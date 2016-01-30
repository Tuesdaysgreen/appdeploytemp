/// <reference path="../typings/main.d.ts" />

import socket = require('socket.io');
import {Connection} from "../common/constants";
import {DirApi} from './dirApi';

export = Main;
module Main {
    'use strict';

    var server = socket.listen(Connection.port);

    console.log("listening on " + Connection.port);

    server.on('connection', function(socket : SocketIO.Socket) {
        console.log("connected");

        var dirApi = new DirApi(socket);
        dirApi.init();
    });

    server.on('disconnect', (listener) =>{
        console.log('disconnected');
        return;
    })
}