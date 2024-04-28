var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = {};


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
server.listen(8081, function () {
    io.on('connection', function (socket) {
        console.log('a user connected');

        players[socket.id] = {
            playerId: socket.id,
            direction: "down",
            x: 0,
            y: 0,      
          };
          // send the players object to the new player
          socket.emit('currentPlayers', players);
          // update all other players of the new player
          socket.broadcast.emit('newPlayer', players[socket.id]);
        

        socket.on('disconnect', function () {
          console.log('user disconnected');
        });
      });


  console.log(`Listening on ${server.address().port}`);
});