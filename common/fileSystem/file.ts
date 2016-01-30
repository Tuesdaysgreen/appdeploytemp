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

        constructor(basePath: string, path : string){
            this.basePath = basePath;
            this.path = path;
        }


    }
}