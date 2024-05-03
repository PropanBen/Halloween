import "./style.css";
import { Socket, io } from "socket.io-client";
import { GameScene } from "./scenes/gameScene.ts";
import { GameConfig } from "./game/gameConfig.ts";
import { Game } from "phaser";
import { GameData } from "./game/gameData.ts";
import { MenuScene } from "./scenes/menuScene.ts";
import { PlayerList } from "./components/playerList.ts";
import { ClientToServerEvents, PlayerTemplate, ServerToClientEvents } from "shared";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    import.meta.env.MODE == "development" ? io("localhost:8081") : io();

socket.on("playertemplates_update", playerTemplateData => {
    let playerTemplate = PlayerTemplate.fromSerialized(playerTemplateData);

    console.log("playerTemplate", playerTemplate);
});

const data: GameData = {
    socket,
    playerList: new PlayerList(socket),
};

const config: GameConfig = {
    type: Phaser.AUTO,
    parent: "gameCanvas",
    pixelArt: true,
    width: document?.getElementById("gameCanvas")?.clientWidth!,
    height: 800,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0, x: 0 },
        },
    },

    scene: [
        {
            create: function (this: Phaser.Scene) {
                this.scene.start("menuscene", data);
            },
        },
        MenuScene,
        GameScene,
    ],
};

new Game(config);
