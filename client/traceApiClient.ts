/// <reference path="../typings/main.d.ts" />

import SocketIOClient = require('socket.io-client');
import {Connection} from "../common/constants";
import {IApi} from '../common/models/iApi';
import {TraceApis} from '../common/constants';

export = Main;
module Main {
    'use strict';

    export class TraceApiClient implements IApi{
        constructor(private _socket : SocketIOClient.Socket){}

        init(){
            this._socket.on(TraceApis.respondTraceInfo, (mesg) => { this._respondTraceInfo(mesg) });
        }

        private _respondTraceInfo(mesg : any){
            console.log(mesg);
        }
    }
}