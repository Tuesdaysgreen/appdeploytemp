/// <reference path="./typings/main.d.ts" />

import client = require('socket.io-client');
import {Connection} from "./common/constants";
import {TraceApiClient} from './client/TraceApiClient';
import {DirApiClient} from './client/DirApiClient';
import {FileApiClient} from './client/FileApiClient';
import {ChangeTracker} from './common/fileSystem/changeTracker';
import {ChangeApiClient} from './client/changeApiClient';
import fs = require('fs');

export = Main;
module Main {
    'use strict';

    console.log("connecting to: " + Connection.url);
    var socket = client.connect(Connection.url);

    var traceClient = new TraceApiClient(socket);
    traceClient.init();

    var changeTracker = new ChangeTracker();
    var dirClient = new DirApiClient(socket, changeTracker);
    dirClient.init();

    var fileClient = new FileApiClient(socket);
    fileClient.init();

    var changeClient = new ChangeApiClient(socket, changeTracker);
    changeClient.init();
}