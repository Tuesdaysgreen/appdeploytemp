/// <reference path="../../typings/main.d.ts" />
import socket = require('socket.io');
import {ISocketService} from './iSocketService';

export = Main;
module Main {
    export class SocketService implements ISocketService {
        constructor(private _socket: SocketIO.Socket){}

        // Purposely not taking in a variable args because the typescript compiler
        // will convert single arguments into an array object before calling
        // the wrapped function.
        public emit(event: string, data : any): ISocketService{
            var socket = this._socket.emit(event, data);
            return new SocketService(socket);
        }

        public on(event: string, fn: Function): ISocketService{
            return new SocketService(this._socket.on(event, fn));
        }
    }
}