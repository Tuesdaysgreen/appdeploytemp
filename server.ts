/// <reference path="./typings/main.d.ts" />

import express = require('express');
import http = require('http');
import socketIO = require('socket.io');
import {Connection} from "./common/constants";
import {DirApi} from './server/dirApi';
import {FileApi} from './server/fileApi';

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

    io.on('connection', function(socket : SocketIO.Socket) {
        console.log("connected");

        var dirApi = new DirApi(socket);
        dirApi.init();

        var fileApi = new FileApi(socket);
        fileApi.init();
    });

    io.on('disconnect', (listener) =>{
        console.log('disconnected');
        return;
    })
}