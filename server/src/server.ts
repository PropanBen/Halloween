import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ClientToServerEvents, PlayerTemplate, ServerToClientEvents } from "shared";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    serveClient: false,
    cors: {},
});

const port = 8081;

app.use(express.static(join(__dirname, "..", "app", "dist")));

const players: Map<string, { id: string; username: string }> = new Map();

const playerTemplates = new PlayerTemplate({
    1: "vampire",
    2: "skeleton",
    3: "zombie",
    4: "witch",
    5: "mummy",
    6: "spider",
    7: "bat",
    8: "werewolf",
    9: "gargoyle",
    10: "ghost",
});

io.on("connection", socket => {
    socket.emit("players_update", Object.fromEntries(players));

    socket.emit("playertemplates_update", playerTemplates);
    socket.emit("player_request_username", socket.id);

    socket.on("player_set_username", (username: string) => {
        let player = { id: socket.id, username: username };
        players.set(socket.id, player);

        socket.broadcast.emit("player_login", player);
        socket.emit("players_update", Object.fromEntries(players));
    });

    socket.on("disconnect", () => {
        players.delete(socket.id);
        socket.broadcast.emit("player_logout", socket.id);
        socket.emit("players_update", Object.fromEntries(players));
    });
});

server.listen(port, () => {
    let address = server.address();

    let port = "unknown";

    if (typeof address == "string") {
        port = address;
    } else {
        port = address?.port?.toString() ?? port;
    }

    console.log(`Listening on ${port}`);
});
