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
  console.log(`Listening on ${server.address().port}`);

  io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    const pt = new playertemplate();
    socket.emit("playertemplate", pt);

    socket.on("getplayerlist", () => {
      io.emit("currentPlayers", playerlist);
    });

    socket.on(
      "createplayerobject",
      ({ playerid, username, playertemplateid }) => {
        const player = createPlayer(playerid, username, playertemplateid);
        playerlist[socket.id] = player;
        io.emit("currentPlayers", playerlist);
      }
    );

    socket.on("getplayerobjectlist", () => {
      io.emit("playerobjectlist", playerlist, pt);
    });

    socket.on("disconnect", () => {
      console.log(`Player disconnected: ${socket.id}`);
      delete playerlist[socket.id];
      io.emit("currentPlayers", playerlist);
    });

    socket.on("playerMovement", (movementData) => {
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
});
