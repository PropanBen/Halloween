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
        players[socket.id] = {
            playerId: socket.id,
        };
        // Emit the current players to the connected client
        socket.emit('currentPlayers', players);

        // Broadcast the new player to all other clients
        socket.broadcast.emit('newPlayer', players[socket.id]);

        socket.on('disconnect', function () {
            // Delete the player from the players object
            delete players[socket.id];
            // Emit logout event to the disconnected client
            socket.emit('logout', socket.id);
            // Broadcast the updated player list to all other clients
            socket.broadcast.emit('currentPlayers', players);
        });
    });

    console.log(`Listening on ${server.address().port}`);
});
