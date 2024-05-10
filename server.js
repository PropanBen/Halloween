var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const playertemplate = require("./public/js/playertemplate.js");
var playerlist = {};

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8081, function () {
  io.on("connection", function (socket) {
    console.log("ID " + socket.id);
    //Show avaiable Playercharacters
    const pt = new playertemplate();
    socket.emit("playertemplate", pt);

    //Show CurrentPlayers
    socket.emit("players", playerlist);

    // Request Playername
    socket.emit("request_username");

    socket.broadcast.emit("playerlist", playerlist);

    // Create Player, add it to playerlist
    socket.on("set_username", ({ playerid, username, playertemplateid }) => {
      var player = createPlayer(playerid, username, playertemplateid);
      playerlist[socket.id] = player;
      io.emit("currentPlayers", playerlist);
    });
    // Send new player to all other players
    socket.broadcast.emit("newPlayer", playerlist[socket.id]);

    // Delete player from playerlist nad send current player list
    socket.on("disconnect", function () {
      delete playerlist[socket.id];
      socket.emit("logout", socket.id);
      socket.broadcast.emit("currentPlayers", playerlist);
    });
  });

  function createPlayer(socketId, playerName, playertemplateid) {
    return {
      playerId: socketId,
      playername: playerName,
      playertemplateid: playertemplateid,
    };
  }

  console.log(`Listening on ${server.address().port}`);
});
