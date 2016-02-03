import {IFileChange} from './iFileChange';

export = Main;
module Main {
    export interface IDirChange extends IFileChange {
        filesNoContentNeeded: number;
    }
}