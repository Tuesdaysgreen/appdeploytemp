/// <reference path="../../typings/main.d.ts" />

export = Main;
module Main {
    export interface IFSService {
        writeFile(fullPath: string, data : any): Q.Promise<any>;
        utimes(fullPath: string, atime: Date, mtime: Date): Q.Promise<any>;
    }
}