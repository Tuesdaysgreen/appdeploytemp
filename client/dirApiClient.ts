/// <reference path="../typings/main.d.ts" />

import SocketIOClient = require('socket.io-client');
import fs = require('fs');

import {IApi} from '../common/interfaces/iApi';
import {DirApis, Paths} from '../common/constants';
import {IFile} from '../common/interfaces/iFile';
import {IDirectory} from '../common/interfaces/iDirectory';
import {Directory} from '../common/fileSystem/Directory';

export =Main;
module Main {
    'use strict';

    export class DirApiClient implements IApi {

        constructor(private _socket : SocketIOClient.Socket){}

        init(){
            this._socket.on(DirApis.requestDir, (path) => { this._requestDir(path) });

            var dir = new Directory(Paths.sBasePath, "/");
            try {
                // Synchronous because we need a sorted list of files
                dir.readDirSync();
            } catch (error) {
                console.log("Error reading dir " + dir.path + ": " + error.Message);
                return;
            }

            this._socket.emit(DirApis.sendDir, dir);
        }

        private _requestDir(file : IFile){
            console.log("received request for dir: " + file.path);
            var dir = new Directory(Paths.sBasePath, file.path + "/");

            try {
                // Synchronous because we need a sorted list of files
                dir.readDirSync();
            } catch (error) {
                console.log("Error reading dir " + dir.path + ": " + error.Message);
                return;
            }

            this._socket.emit(DirApis.sendDir, dir);
        }
    }
}