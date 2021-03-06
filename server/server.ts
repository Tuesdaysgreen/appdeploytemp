/// <reference path="../typings/main.d.ts" />

import express = require('express');
import http = require('http');
import socketIO = require('socket.io');
import {SocketService} from '../common/services/SocketService';
import {Connection} from "../common/constants";
import {DirApi} from './dirApi';
import {FileApi} from './fileApi';
import {FSService} from '../common/services/fsService'

export = Main;
module Main {
    'use strict';
    var app = express();
    var server = http.createServer(app);
    var io = socketIO(server);
    var port = process.env.PORT || Connection.port;
    server.listen(port, () =>{
        console.log("Listening on port " + port);
    });

    var fsService = new FSService();

    io.on('connection', function(socket : SocketIO.Socket) {
        console.log("connected");

        var socketService = new SocketService(socket);

        var dirApi = new DirApi(socket);
        dirApi.init();

        var fileApi = new FileApi(socketService, fsService);
        fileApi.init();
    });

    io.on('disconnect', (listener) =>{
        console.log('disconnected');
        return;
    })
}