/// <reference path="../../typings/main.d.ts" />

import fs = require('fs');
import {File} from './File';
import {IFile} from '../interfaces/iFile';
import {IDirectory} from '../interfaces/iDirectory';

export = Main;
module Main{
    'use strict';

    export class Directory extends File implements IDirectory{
        public files: IFile[] = [];

        constructor(basePath : string, path : string){
            super(basePath, path);
        }

        public readDirSync() : void{
            var fileNames = fs.readdirSync(this.basePath + this.path);
            if (!fileNames || fileNames.length === 0) {
                return;
            }

            var files: IFile[] = [];
            fileNames.forEach((fileName: string) => {
                var stats = fs.statSync(this.basePath + this.path + fileName);

                var fileMeta = <IFile>{
                    name: fileName,
                    path: this.path + fileName,
                    basePath: this.basePath,
                    size: stats["size"],
                    modified: stats["mtime"],
                    isDirectory: stats.isDirectory()
                }

                files.push(fileMeta);
            });

            this.files = files;
        }

        public create(callback? : (error : NodeJS.ErrnoException) => void){
            fs.mkdir(this.basePath + this.path, (error) => callback(error));
        }

        public static deleteFile(basePath : string, file: IFile, callback?: (err?: NodeJS.ErrnoException) => void){
            var path = basePath + file.path;

            if(file.isDirectory){
                // TODO: change to async
                try {
                    this._deleteFolderRecurseSync(path);
                    callback(null);
                }
                catch(error){
                    callback(error);
                    return;
                }
            }
            else{
                fs.unlink(path, callback);
            }
        }

        private static _deleteFolderRecurseSync(path : string) {
            var files = [];
            if (fs.existsSync(path)) {
                files = fs.readdirSync(path);
                files.forEach(function(file, index) {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        Directory._deleteFolderRecurseSync(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };
    }
}