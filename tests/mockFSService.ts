/// <reference path="../typings/main.d.ts" />

import fs = require('fs');
import {IFile} from '../common/models/iFile';
import {File} from '../common/fileSystem/file';
import {IFSService} from '../common/services/iFSService';
import sinon = require('sinon');
import Q = require('q');

export = Main;
module Main {

    export class MockBaseFSService implements IFSService{
        public writeFile(fullPath: string, data: any): Q.Promise<any> {
            return null;
        }

        public utimes(fullPath: string, atime: Date, mtime: Date): Q.Promise<any> {
            return null;
        }
    }

    // export class MockFSService implements IFSService{
    export class MockFSService extends MockBaseFSService{
        private _files = {};

        constructor() { super();}

        public CreateMockFile(fullPath : string) : File{
            var file = this._getEmptyFile(fullPath);
            file.modified = new Date(2016, 1, 1);
            file.content = "Some content";
            file.size = file.content.length;

            this._files[fullPath] = this._cloneFile(file);
            return file;
        }

        public getMockFile(fullPath : string) : File{
            return this._files[fullPath];
        }

        public writeFile(fullPath: string, data: any): Q.Promise<any> {
            var file = this._getEmptyFile(fullPath);
            file.modified = new Date();
            file.content = data;
            file.size = data.length;
            this._files[fullPath] = file;
            return Q(null);
        }

        public utimes(fullPath: string, atime: Date, mtime: Date): Q.Promise<any> {
            var file = <File>this._files[fullPath];
            if(file){
                file.modified = mtime;
                return Q(null);
            }

            return Q(new Error(`Could not find file ${fullPath} to call utimes on`));
        }

        private _getEmptyFile(fullPath : string) : File{
            var lastSlashIndex = fullPath.lastIndexOf('/');
            var dirPath = fullPath.slice(0, lastSlashIndex);
            var fileName = fullPath.slice(lastSlashIndex, fullPath.length - 1);

            return new File(this, dirPath, fileName);
        }

        private _cloneFile(file : File) : File{
            return JSON.parse(JSON.stringify(file));
        }
    }
}