/// <reference path="../../typings/main.d.ts" />

import fs = require('fs');
import {IFile} from '../interfaces/iFile';

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

        constructor(basePath: string, path : string){
            this.basePath = basePath;
            this.path = path;
            this.fullPath = File.getFullPath(basePath, path);
        }

        public static getFullPath(basePath : string, path : string) : string{
            if(path === '/'){
                return basePath;
            }

            return basePath + path;
        }

        public save(callback? : (error : NodeJS.ErrnoException) => void){
            fs.exists(this.fullPath, (exists) =>{
                if (exists) {
                    fs.unlink(this.fullPath, (error) => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        this._saveHelper(this.fullPath, (error) => { callback(error) });
                        // fs.writeFile(fullPath, this.content, (error) => { callback(error) });
                    })
                }
                else {
                    this._saveHelper(this.fullPath, (error) => { callback(error) });
                }
            })
        }

        private _saveHelper(fullPath : string, callback : (error : NodeJS.ErrnoException) =>void){
            fs.writeFile(fullPath, this.content, (error) => {
                if (!error) {

                    fs.utimes(fullPath, new Date(), this.modified, (error) =>{
                        callback(error);
                    })
                }
                else {
                    callback(error);
                }
            });
        }
    }
}