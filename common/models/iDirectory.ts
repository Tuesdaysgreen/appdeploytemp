import {IFile} from './iFile';

export = Main;
module Main {
    'use strict';
    export interface IDirectory extends IFile {
        files: IFile[];
    }
}