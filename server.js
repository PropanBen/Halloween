var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const playertemplate = require('./public/js/playertemplate.js');
var playerlist = {};


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function () {

 
    io.on('connection', function (socket) {

        //Show avaiable Playercharacters
        const pt= new playertemplate();
        io.emit('playertemplate',pt);

        //Show CurrentPlayers
        io.emit('currentPlayers', playerlist);
    
        // Request Playername
        socket.emit('request_username');

        // Create Player, add it to playerlist
        socket.on('set_username', (username) => {
            var player = createPlayer(socket.id, username); 
            playerlist[socket.id] = player;
            io.emit('currentPlayers', playerlist);
        });
    
        // Send new player to all other players
        socket.broadcast.emit('newPlayer', playerlist[socket.id]);
  


        // Delete player from playerlist nad send current player list
        socket.on('disconnect', function () {
            delete playerlist[socket.id];
            socket.emit('logout', socket.id);
            socket.broadcast.emit('currentPlayers', playerlist);
        });
    });


    function createPlayer(socketId, playerName) {
        return {
            playerId: socketId,
            playername: playerName
        };
    }
    


    console.log(`Listening on ${server.address().port}`);
});
