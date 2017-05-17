var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var roomno = 1;
var curRoom = '';
io.on('connection', function(socket){

  socket.on('room', function(room) {
      socket.join(room);
      carRoom = room;
  });
  socket.on('roomMessage',function(data){
    // room = "abc123";
    io.sockets.in(data.room).emit('message', data.message);
    io.sockets.in('foobar').emit('message', 'anyone in this room yet?');
  })

    // new room for new client
    // if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 0)
    //   roomno++;
    // socket.join("room-"+roomno);

    // //Send this event to everyone in the room.
    // io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);



  socket.on('mousecursor', function(data){
    io.in(data.room).emit('mousecursor', data.mouse);
  });
  socket.on('connected', function(data){
    io.in(data.room).emit('connected', data.props);
  });
  socket.on('inputchange', function(data){
    io.in(data.room).emit('inputchange', data.inputs);
  });
  socket.on('message', function(msg){
    io.emit('message', msg);
  });
  socket.on('initRoom', function(data){
    io.emit('initRoom', data);
  });

});
http.listen(port, function(){
  console.log('listening on *:' + port);
});

