/// <reference path="../../typings/main.d.ts" />

export = Main;
module Main {
    export interface IFSService {
        // exists(fullPath: string): Q.Promise<boolean>;
        // unlink(fullPath: string): Q.Promise<any>;
        writeFile(fullPath: string, data : any): Q.Promise<any>;
        utimes(fullPath: string, atime: Date, mtime: Date): Q.Promise<any>;
    }
}