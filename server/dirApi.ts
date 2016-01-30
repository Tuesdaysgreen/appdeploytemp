/// <reference path="../typings/main.d.ts" />

import socket = require('socket.io');
import {IApi} from '../common/interfaces/iApi';
import {TraceApis, FileApis} from '../common/constants';
import {DirApis} from '../common/constants';
import {IFile} from '../common/interfaces/iFile';
import {Directory} from '../common/fileSystem/directory';
import {IDirectory} from '../common/interfaces/iDirectory';


export=Main;
module Main{
    'use strict';

    export class DirApi implements IApi{
        private _basePath = '/scratch/dest';

        constructor(private _socket : SocketIO.Socket){}

        init(){
            this._socket.on(DirApis.sendDir, (data: any) => { this._sendDir(data); });
        }

        private _sendDir(sourceDir : IDirectory) {

            var dir = new Directory(this._basePath, sourceDir.path);
            dir.readDir(() => {
                this._compareFiles(sourceDir.files, dir.files);
            });
        }

        private _compareFiles(sourceFiles: IFile[], destFiles: IFile[]) {
            if (sourceFiles.length === 0 && destFiles.length === 0) {
                return;
            }

            var s = 0;
            var d = 0;

            while (s < sourceFiles.length && d < destFiles.length) {
                var sFile = sourceFiles[s];
                var dFile = destFiles[d];

                var sName = sFile.name.toLowerCase();
                var dName = dFile.name.toLowerCase();

                if (sName === dName) {
                    // Paths match

                    if (sFile.isDirectory === dFile.isDirectory) {
                        this._handleFileNameAndTypeMatch(sourceFiles[s], destFiles[d]);
                    }
                    else {
                        // File types don't match.
                        this._deleteFile(dFile, () =>{
                            this._requestFile(sFile);
                        });
                    }

                    s++;
                    d++;

                }
                else if (sName < dName) {
                    // File only exists on source
                    this._requestFile(sFile);
                    s++;
                }
                else{
                    // File doesn't exist on source
                    this._deleteFile(dFile);
                    d++;
                }
            }

            while(s < sourceFiles.length){
                // Request remaining files from client
                this._requestFile(sourceFiles[s++]);
            }

            while(d < destFiles.length){
                // Delete remaining files on server
                this._deleteFile(destFiles[d++]);
            }
        }

        private _requestFile(file : IFile){
            if(file.isDirectory){
                this._socket.emit(DirApis.requestDir, file);
            }
            else{
                this._socket.emit(FileApis.requestFile, file);
            }
        }

        private _deleteAllFiles(files : IFile[]){
            files.forEach((file) => {
                this._deleteFile(file);
            });
        }

        private _deleteFile(file : IFile, callback? : () => void){
            this._socket.emit(TraceApis.respondTraceInfo, "Deleting file: " + file.path);

            Directory.deleteFile(this._basePath, file, (error) => {
                if (error) {
                    this._socket.emit(TraceApis.respondTraceInfo, "error deleting file: " + error.message);
                    return;
                }

                if (callback) {
                    callback();
                }
            })
        }

        private _handleFileNameAndTypeMatch(sourceFile : IFile, destFile : IFile){
            if(sourceFile.isDirectory){
                this._socket.emit(DirApis.requestDir, sourceFile);
            }
            else{
                // Turns into a string after it's serialized from the client.
                sourceFile.modified = new Date(<any>sourceFile.modified);

                if(sourceFile.size !== destFile.size
                    || sourceFile.modified.getTime() !== destFile.modified.getTime()){

                    this._socket.emit(FileApis.requestFile, sourceFile);
                }
            }
        }
    }
}