/// <reference path="../typings/main.d.ts" />

import SocketIOClient = require('socket.io-client');
import fs = require('fs');

import {IApi} from '../common/models/iApi';
import {FileApis, Paths} from '../common/constants';
import {IFile} from '../common/models/iFile';
import {Directory} from '../common/fileSystem/Directory';

export =Main;
module Main {
    'use strict';

    export class FileApiClient implements IApi {
        constructor(private _socket: SocketIOClient.Socket) { }

        init(){
            this._socket.on(FileApis.requestFile, (file) => { this._requestFile(file) });
        }

        private _requestFile(file : IFile){
            console.log("got request for file: " + file.path);

            fs.readFile(Paths.sBasePath + file.path, (error, data) =>{
                if(error){
                    console.log("Failed to read file " + file.path + ": " + error.message);
                    return;
                }

                file.content = data;

                this._socket.emit(FileApis.sendFile, file);
            });
        }
    }
}