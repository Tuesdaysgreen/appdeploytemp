var io1 = require('socket.io').listen(3000);

console.log("listening on 3000");

io1.on('connection', function(socket1) {
  console.log("connected");

  socket1.on('foo', function(msg1) {
    console.log(msg1);
  });
});