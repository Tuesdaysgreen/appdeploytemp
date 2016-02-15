/// <reference path="../typings/main.d.ts" />

import socket = require('socket.io');
import {IApi} from '../common/models/iApi';
import {TraceApis, FileApis, Paths, ChangeApis} from '../common/constants';
import {DirApis} from '../common/constants';
import {IFile} from '../common/models/iFile';
import {File} from '../common/fileSystem/file';
import {IFileChange} from '../common/models/iFileChange';
import {IFSService} from '../common/services/iFSService';

export = Main;
module Main {
    'use strict';

    export class FileApi implements IApi {
        constructor(
            private _socket: SocketIO.Socket,
            private _fs : IFSService){}

        init(){
            this._socket.on(FileApis.sendFile, (file) => { this._sendFileApi(file) });
        }

        private _sendFileApi(sFile : IFile){
            var path = Paths.dBasePath + sFile.path;
            var file = new File(this._fs, Paths.dBasePath, sFile.path);
            file.content = sFile.content;

            // Date gets turned into a string after serialization
            file.modified = new Date(<any>sFile.modified);

            this._socket.emit(TraceApis.respondTraceInfo, "Write file: " + file.path);
            file.save().then(() => {
                var change = <IFileChange>{ path: file.path };
                this._socket.emit(ChangeApis.respondFileChange, change);
            },
            (error) => {
                this._socket.emit(
                    TraceApis.respondTraceInfo,
                    "Error saving file " + file.path + ": " + error.message);
            }).catch((error) => {
                this._socket.emit(
                    TraceApis.respondTraceInfo,
                    "Exception caught while saving file " + file.path + ": " + error);
            }).done();
        }
    }
}