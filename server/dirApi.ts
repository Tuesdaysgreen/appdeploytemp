/// <reference path="../typings/main.d.ts" />

import socket = require('socket.io');
import {IApi} from '../common/interfaces/iApi';
import {TraceApis, FileApis, Paths} from '../common/constants';
import {DirApis} from '../common/constants';
import {IFile} from '../common/interfaces/iFile';
import {Directory} from '../common/fileSystem/directory';
import {IDirectory} from '../common/interfaces/iDirectory';
import {DirFileRequestTracker} from './dirFileRequestTracker';

export=Main;
module Main{
    'use strict';

    export class DirApi implements IApi{

        constructor(private _socket : SocketIO.Socket){}

        init(){
            this._socket.on(DirApis.sendDir, (data: any) => { this._sendDirApi(data); });
        }

        private _sendDirApi(sourceDir : IDirectory) {

            var dir = new Directory(Paths.dBasePath, sourceDir.path);

            try{
                // Synchronous because we need a sorted list of files
                dir.readDirSync();
            }catch(error){
                this._socket.emit(
                    TraceApis.respondTraceInfo,
                    "Error reading dir " + dir.path + ": " + error);
                return;
            }

            this._compareFiles(sourceDir, sourceDir.files, dir.files);
        }

        private _compareFiles(sDir : IDirectory, sourceFiles: IFile[], destFiles: IFile[]) {
            // if (sourceFiles.length === 0 && destFiles.length === 0) {
            //     return;
            // }

            var s = 0;
            var d = 0;
            var tracker = new DirFileRequestTracker(this._socket, sDir);

            while (s < sourceFiles.length && d < destFiles.length) {
                var sFile = sourceFiles[s];
                var dFile = destFiles[d];

                var sName = sFile.name.toLowerCase();
                var dName = dFile.name.toLowerCase();

                if (sName === dName) {
                    // Paths match

                    if (sFile.isDirectory === dFile.isDirectory) {
                        this._handleFileNameAndTypeMatch(sourceFiles[s], destFiles[d], tracker);
                    }
                    else {
                        // File types don't match.
                        this._deleteFile(dFile, () =>{
                            this._requestFileOrDir(sFile, tracker);
                        });
                    }

                    s++;
                    d++;

                }
                else if (sName < dName) {
                    // File only exists on source
                    this._requestFileOrDir(sFile, tracker);
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
                this._requestFileOrDir(sourceFiles[s++], tracker);
            }

            while(d < destFiles.length){
                // Delete remaining files on server
                this._deleteFile(destFiles[d++]);
            }

            tracker.done();
        }

        private _requestFileOrDir(file : IFile, tracker : DirFileRequestTracker){
            if(file.isDirectory){

                var dir = new Directory(Paths.dBasePath, file.path);
                try{
                    dir.createSync();
                    this._socket.emit(DirApis.requestDir, file);
                }catch(error){
                    this._socket.emit(TraceApis.respondTraceInfo,
                        "Error creating directory " + file.path + ": " + error);
                }
            }
            else{
                this._requestFile(file, tracker);
            }
        }

        private _requestFile(file : IFile, tracker : DirFileRequestTracker){
            tracker.requestFile();
            this._socket.emit(FileApis.requestFile, file);
        }

        private _deleteAllFiles(files : IFile[]){
            files.forEach((file) => {
                this._deleteFile(file);
            });
        }

        private _deleteFile(file : IFile, callback? : () => void){
            this._socket.emit(TraceApis.respondTraceInfo, "Deleting file: " + file.path);

            Directory.deleteFile(Paths.dBasePath, file, (error) => {
                if (error) {
                    this._socket.emit(TraceApis.respondTraceInfo, "error deleting file: " + error.message);
                    return;
                }

                if (callback) {
                    callback();
                }
            })
        }

        private _handleFileNameAndTypeMatch(
            sFile : IFile,
            dFile : IFile,
            tracker : DirFileRequestTracker){

            if(sFile.isDirectory){
                this._socket.emit(DirApis.requestDir, sFile);
            }
            else{
                // Turns into a string after it's serialized from the client.
                sFile.modified = new Date(<any>sFile.modified);

                if(sFile.size !== dFile.size || !this._timesMatch(sFile.modified, dFile.modified)){
                    this._requestFile(sFile, tracker);
                }
            }
        }

        // Unfortunately setting the modified timestamp on a file doesn't
        // save the milliseconds.  So the best we can do here is compare
        // to seconds
        private _timesMatch(sDate : Date, dDate : Date) : boolean{
            return sDate.getFullYear() === dDate.getFullYear()
                && sDate.getMonth() === dDate.getMonth()
                && sDate.getDay() === dDate.getDay()
                && sDate.getHours() === dDate.getHours()
                && sDate.getMinutes() === dDate.getMinutes()
                && sDate.getSeconds() === dDate.getSeconds();
        }
    }
}