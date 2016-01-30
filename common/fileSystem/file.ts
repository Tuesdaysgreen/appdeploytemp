/// <reference path="../../typings/main.d.ts" />

import fs = require('fs');
import {IFile} from '../interfaces/iFile';

export = Main;
module Main{
    export class File implements IFile{
        public name: string;
        public path: string;
        public basePath: string;
        public size: number;
        public modified: Date;
        public isDirectory: boolean;
        public content: any;

        constructor(basePath: string, path : string){
            this.basePath = basePath;
            this.path = path;
        }

        public save(callback? : (error : NodeJS.ErrnoException) => void){
            var fullPath = this.basePath + this.path;
            fs.exists(fullPath, (exists) =>{
                if (exists) {
                    fs.unlink(fullPath, (error) => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        this._saveHelper(fullPath, (error) => { callback(error) });
                        // fs.writeFile(fullPath, this.content, (error) => { callback(error) });
                    })
                }
                else {
                    this._saveHelper(fullPath, (error) => { callback(error) });
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