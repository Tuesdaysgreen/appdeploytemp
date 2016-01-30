/// <reference path="./typings/main.d.ts" />
var socket = require('socket.io');
var constants_1 = require("./common/constants");
var dirApi_1 = require('./server/dirApi');
var fileApi_1 = require('./server/fileApi');
var Main;
(function (Main) {
    'use strict';
    var server = socket.listen(constants_1.Connection.port);
    console.log("listening on " + constants_1.Connection.port);
    server.on('connection', function (socket) {
        console.log("connected");
        var dirApi = new dirApi_1.DirApi(socket);
        dirApi.init();
        var fileApi = new fileApi_1.FileApi(socket);
        fileApi.init();
    });
    server.on('disconnect', function (listener) {
        console.log('disconnected');
        return;
    });
})(Main || (Main = {}));
module.exports = Main;
//# sourceMappingURL=server.js.map