/// <reference path="../../typings/main.d.ts" />
import socket = require('socket.io');

export = Main;
module Main {
    export interface ISocketService {
        emit(event: string, data : any): ISocketService;
        on(event: string, fn: Function): ISocketService;
    }
}