/// <reference path="./typings/main.d.ts" />

import socket = require('socket.io');

var io = socket.listen(3000);

console.log("listening on 3000");

io.on('connection', function(listener) {
    console.log("connected");

    listener.on('foo', function(msg) {
        console.log(msg);
        io.emit('hello', 'world');
    });
});

// var io1 = require('socket.io').listen(3000);

// console.log("listening on 3000");

// io1.on('connection', function(socket1) {
//     console.log("connected");

//     socket1.on('foo', function(msg1) {
//         console.log(msg1);
//     });
// });