/// <reference path="../typings/main.d.ts" />

import socket = require('socket.io');
import {IApi} from '../common/interfaces/iApi';
import {TraceApis, FileApis, Paths, ChangeApis} from '../common/constants';
import {DirApis} from '../common/constants';
import {IFile} from '../common/interfaces/iFile';
import {File} from '../common/fileSystem/file';
import {IFileChange} from '../common/interfaces/iFileChange';
import fs = require('fs');

export = Main;
module Main {
    'use strict';

    export class FileApi implements IApi {
        constructor(private _socket: SocketIO.Socket){}

        init(){
            this._socket.on(FileApis.sendFile, (file) => { this._sendFile(file) });
        }

        private _sendFile(sFile : IFile){
            var path = Paths.dBasePath + sFile.path;
            var file = new File(Paths.dBasePath, sFile.path);
            file.content = sFile.content;

            // Date gets turned into a string after serialization
            file.modified = new Date(<any>sFile.modified);

            this._socket.emit(TraceApis.respondTraceInfo, "Write file: " + file.path);
            file.save((error) =>{
                if(error){
                    this._socket.emit(
                        TraceApis.respondTraceInfo,
                        "Error saving file " + file.path + ": " + error.message);
                }
                else{

                    var change = <IFileChange>{ path: file.path };
                    this._socket.emit(ChangeApis.respondFileChange, change);
                }
            });
        }
    }
}