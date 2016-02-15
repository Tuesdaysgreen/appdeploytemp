/// <reference path="../../typings/main.d.ts" />
import {IFSService} from '../services/iFSService';
import fs = require('fs');
import Q = require('q');

export = Main;
module Main {
    export class FSService implements IFSService {
        // public exists(fullPath: string): Q.Promise<boolean>{
        //     var defer = Q.defer<boolean>();
        //     fs.exists(fullPath, (exists) =>{
        //         defer.resolve(exists);
        //     });

        //     return defer.promise;
        // }

        // public unlink(fullPath: string): Q.Promise<any>{
        //     var defer = Q.defer<any>();
        //     fs.unlink(fullPath, (error) =>{
        //         if(error){
        //             defer.reject(error);
        //         }
        //         else{
        //             defer.resolve();
        //         }
        //     });

        //     return defer.promise;
        // }

        public writeFile(fullPath: string, data: any): Q.Promise<any>{
            var defer = Q.defer<any>();
            fs.writeFile(fullPath, data, (error) =>{
                if(error){
                    defer.reject(error);
                }
                else{
                    defer.resolve();
                }
            });

            return defer.promise;
        }

        public utimes(fullPath: string, atime: Date, mtime: Date): Q.Promise<any>{
            var defer = Q.defer<any>();
            fs.utimes(fullPath, atime, mtime, (error) =>{
                if (error) {
                    defer.reject(error);
                }
                else {
                    defer.resolve();
                }
            });

            return defer.promise;
        }

    }
}