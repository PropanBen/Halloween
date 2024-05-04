import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { GameData } from "../game/gameData";
import { PlayerDisplay } from "../components/playerDisplay";

import player from "#/sprites/player/player.png";

// Define menuscene
export class MenuScene extends Phaser.Scene {
    protected socket?: Socket;
    protected playerDisplay?: PlayerDisplay;
    protected gameData?: GameData;
    constructor() {
        super({ key: "menuscene" });
    }

    preload() {
        // Preload assets specific to menuscene
        this.load.spritesheet("player", player, { frameWidth: 64, frameHeight: 64 });
    }

    init(gameData: GameData) {
        this.gameData = gameData;
    }

    create() {
        this.playerDisplay = new PlayerDisplay(this, this.gameData?.playerList!);

        const gameCanvas = document.getElementById("gameCanvas");

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.name = "username";
        usernameInput.placeholder = "Enter your name";
        usernameInput.style.fontSize = "20px";
        usernameInput.style.padding = "10px";

        gameCanvas?.appendChild(usernameInput);

        // Button to submit username
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.style.fontSize = "20px";
        submitButton.style.padding = "10px";
        submitButton.style.marginTop = "10px";

        submitButton.addEventListener("click", () => {
            const username = usernameInput.value;
            if (username.trim() !== "") {
                this.gameData?.socket.emit("player_set_username", username);
                usernameInput.style.display = "none";
                submitButton.style.display = "none";
            }
        });

        gameCanvas?.appendChild(submitButton);

        // Add a button to switch to the GameScene
        const button = this.add.text(400, 300, "Start Game", { backgroundColor: "#0f0" }).setInteractive();
        button.on("pointerdown", () => {
            this.scene.start("gamescene", this.gameData); // Replace 'gamescene' with your actual key for the GameScene
        });
    }

    update() {}
}
