/// <reference path="../typings/main.d.ts" />

import client = require('socket.io-client');
import {Connection} from "../common/constants";
import {TraceApiClient} from './TraceApiClient';
import {DirApiClient} from './DirApiClient';
import {FileApiClient} from './FileApiClient';

export = Main;
module Main {
    'use strict';
    var socket = client.connect('http://localhost:' + Connection.port);

    var traceClient = new TraceApiClient(socket);
    traceClient.init();

    var dirClient = new DirApiClient(socket);
    dirClient.init();

    var fileClient = new FileApiClient(socket);
    fileClient.init();

    // socket.emit('sendDirMetadata', 'foo');
}
