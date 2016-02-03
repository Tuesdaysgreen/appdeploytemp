/// <reference path="../typings/main.d.ts" />

import SocketIOClient = require('socket.io-client');
import fs = require('fs');

import {IApi} from '../common/interfaces/iApi';
import {ChangeTracker} from '../common/fileSystem/changeTracker';
import {ChangeApis} from '../common/constants';
import {IDirChange} from '../common/interfaces/iDirChange';
import {IFileChange} from '../common/interfaces/iFileChange';

export =Main;
module Main {
    'use strict';

    export class ChangeApiClient implements IApi {

        constructor(
            private _socket: SocketIOClient.Socket,
            private _tracker : ChangeTracker) {
        }

        init() {
            this._socket.on(ChangeApis.respondDirChange, (path) => { this._respondDirChangeApi(path) });
            this._socket.on(ChangeApis.respondFileChange, (path) => { this._respondFileChangeApi(path) });
        }

        private _respondDirChangeApi(dirChange : IDirChange){
            this._decrementTracker(dirChange.path, dirChange.filesNoContentNeeded);
        }

        private _respondFileChangeApi(fileChange : IFileChange){
            var path = fileChange.path;
            var slashIndex = path.lastIndexOf('/');
            var dirPath = null;

            if(slashIndex > 0){
                dirPath = path.slice(0, slashIndex+1);
            }
            else{
                dirPath = '/';
            }

            this._decrementTracker(dirPath, 1);
        }

        private _decrementTracker(dirPath : string, count : number){
            this._tracker.dec(dirPath, count);

            if (this._tracker.getTrackedDirCount() === 0) {
                console.log("Sync complete");
                process.exit(0);
            }
        }
    }
}