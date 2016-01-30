/// <reference path="../typings/main.d.ts" />

import SocketIOClient = require('socket.io-client');
import fs = require('fs');

import {IApi} from '../common/interfaces/iApi';
import {DirApis} from '../common/constants';
import {IFile} from '../common/interfaces/iFile';
import {IDirectory} from '../common/interfaces/iDirectory';
import {Directory} from '../common/fileSystem/Directory';

export =Main;
module Main {
    'use strict';

    export class DirApiClient implements IApi {
        private _basePath = "/scratch/source";

        constructor(private _socket : SocketIOClient.Socket){}

        init(){
            this._socket.on(DirApis.requestDir, (path) => { this._requestDir(path) });

            var dir = new Directory(this._basePath, "/");
            dir.readDir(() => this._readDirEnd(dir));
        }

        private _readDirEnd(dir : IDirectory){
            this._socket.emit(DirApis.sendDir, dir);
        }

        private _requestDir(file : IFile){
            console.log("received request for dir: " + file.path);
            var dir = new Directory(this._basePath, file.path + "/");
            dir.readDir(() => this._readDirEnd(dir));
        }
    }
}