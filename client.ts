/// <reference path="./typings/main.d.ts" />

import client = require('socket.io-client');
var socket = client.connect('http://localhost:3000');

socket.emit('foo', 'bar');

socket.on('hello', (mesg) =>{
    console.log(mesg);
});


// var io2 = require('socket.io-client');
// var socket2 = io2.connect('http://localhost:3000');

// var msg2 = "bar";
// socket2.emit('foo', msg2);