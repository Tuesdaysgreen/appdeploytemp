/// <reference path="../typings/main.d.ts" />

import fs = require('fs');
import socket = require('socket.io');
import {ChangeApis} from '../common/constants';
import {IDirChange} from '../common/interfaces/iDirChange';
import {IDirectory} from '../common/interfaces/iDirectory';
export = Main;
module Main {
    'use strict';

    // Keep track of changes in a directory that require a file
    // to be sent from the client
    export class DirFileRequestTracker {
        private _requestedFiles = 0;

        constructor(
            private _socket : SocketIO.Socket, private _dir : IDirectory){}

        public requestFile() : void{
            if(++this._requestedFiles > this._dir.files.length){
                throw Error("More are being synced than # files in source directory");
            }
        }

        public done() {
            var change = <IDirChange>{
                path: this._dir.path,
                filesNoContentNeeded: this._dir.files.length - this._requestedFiles
            };

            this._socket.emit(ChangeApis.respondDirChange, change);
        }
    }
}