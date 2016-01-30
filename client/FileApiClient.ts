/// <reference path="../typings/main.d.ts" />

import SocketIOClient = require('socket.io-client');
import fs = require('fs');

import {IApi} from '../common/interfaces/iApi';
import {FileApis} from '../common/constants';
import {IFile} from '../common/interfaces/iFile';
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
        }
    }
}