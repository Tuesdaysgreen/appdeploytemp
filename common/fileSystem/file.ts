/// <reference path="../../typings/main.d.ts" />

import fs = require('fs');
import {IFile} from '../models/iFile';
import {IFSService} from '../services/iFSService';
// import {FSService} from '../services/fsService';
import Deps = require('ts-dependency-injection');

export = Main;
module Main{
    export class File implements IFile{
        public name: string;
        public path: string;
        public basePath: string;
        public fullPath: string;
        public size: number;
        public modified: Date;
        public isDirectory: boolean;
        public content: any;

        constructor(private _fs : IFSService,
                            basePath: string,
                            path : string){

            this.basePath = basePath;
            this.path = path;
            this.fullPath = File.getFullPath(basePath, path);
        }

        @Deps.Injection(IFSService)
        public fs2: IFSService;

        public static getFullPath(basePath : string, path : string) : string{
            if(path === '/'){
                return basePath;
            }

            return basePath + path;
        }

        public save(): Q.Promise<any> {
            return this._fs.writeFile(this.fullPath, this.content).then(() => {
                return this._fs.utimes(this.fullPath, new Date(), this.modified);
            });
        }
    }
}