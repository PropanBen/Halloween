var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const playertemplate = require("./public/js/playertemplate");
var playerlist = {};

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8081, function () {
  io.on("connection", function (socket) {
    //Show avaiable Playercharacters
    const pt = new playertemplate();
    socket.emit("playertemplate", pt);

    //Show CurrentPlayers
    io.emit("players", playerlist);

    socket.on("getplayerlist", (...args) => {
      socket.emit("players", playerlist);
    });

    socket.on("getplayertemplates", () => {
      socket.emit("playerstemplates", pt);
    });

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

    socket.on("disconnect", function () {
      delete playerlist[socket.id];
      io.emit("currentPlayers", playerlist); // Emit to all clients
    });

    // Listen for player movement data from clients
    socket.on("playerMovement", function (movementData) {
      // Broadcast the player movement data to all connected clients including the sender
      io.emit("playerMoved", {
        playerId: socket.id,
        x: movementData.x,
        y: movementData.y,
        animation: movementData.animation,
      });
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
