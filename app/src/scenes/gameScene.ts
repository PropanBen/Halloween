import { Scene } from "phaser";
import { InputManager } from "../managers/inputManager";
import { CameraManager } from "../managers/cameraManager";
import { GameData } from "../game/gameData";

import tilemap from "#/sprites/map/tilemap.json";
import background from "#/sprites/world/background.png";
import player from "#/sprites/player/player.png";
import gras from "#/sprites/world/ground/gras.png";
import stone from "#/sprites/world/obstacles/stone.png";
import { PlayerDisplay } from "../components/playerDisplay";

export class GameScene extends Scene {
    public player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected inputManager?: InputManager;
    protected cameraManager?: CameraManager;
    protected gameData?: GameData;
    protected playerDisplay?: PlayerDisplay;

    constructor() {
        super({ key: "gamescene", active: false });
    }

    init(gameData: GameData) {
        this.gameData = gameData;
    }

    preload() {
        this.load.image("background", background);
        this.load.spritesheet("player", player, { frameWidth: 64, frameHeight: 64 });

        //Map
        this.load.tilemapTiledJSON("tilemap", tilemap);

        // Load tileset images
        this.load.image("gras", gras);
        this.load.image("stone", stone);
    }

    create() {
        this.inputManager = new InputManager(this);
        this.cameraManager = new CameraManager(this);
        this.playerDisplay = new PlayerDisplay(this, this.gameData?.playerList!);

        console.log(this.gameData);

        //Map
        const map = this.make.tilemap({ key: "tilemap" });

        // Add tilesets
        // const grasTileset = map.addTilesetImage('gras')!;
        const stoneTileset = map.addTilesetImage("stone")!;

        // Create layers
        // const groundLayer = map.createLayer('ground', grasTileset, 0, 0);
        const obstacleLayer = map.createLayer("obstacles", stoneTileset, 0, 0)!;

        // Define World Bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Set collision for obstacle layer
        obstacleLayer.setCollisionByExclusion([-1]); // Collide with all tiles except those with index -1

        // Player
        this.player = this.physics.add.sprite(800, 200, "player");
        this.physics.world.enable(this.player);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1, 1);
        this.physics.add.collider(this.player, obstacleLayer);

        // Collide player with obstacle layer
        this.physics.add.collider(this.player, obstacleLayer);

        this.cameraManager.cameraFollow(this.player);
    }

    update() {
        this.inputManager?.updatePlayerMovement();
    }
}
