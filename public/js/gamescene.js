class gamescene extends Phaser.Scene {
  constructor() {
    super({ key: "gamescene" });
  }

  showDebugText = false;  // If true, it shows Touching and Blocked properties from the player object. Only for testing and for understanding the collision logic of Phaser
  debugtext;

  preload() {
    this.load.image("background", "assets/sprites/world/background.png");

    this.load.spritesheet("player", "assets/sprites/player/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("vampire", "assets/sprites/player/vampire.png", {
      frameWidth: 229,
      frameHeight: 326,
    });
    this.load.spritesheet("skeleton", "assets/sprites/player/skeleton.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("zombie", "assets/sprites/player/zombie.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("witch", "assets/sprites/player/witch.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("mummy", "assets/sprites/player/mummy.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("spider", "assets/sprites/player/spider.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("bat", "assets/sprites/player/bat.png", {
      frameWidth: 282,
      frameHeight: 195,
    });
    this.load.spritesheet("werewolf", "assets/sprites/player/werewolf.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("ghost", "assets/sprites/player/ghost.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("alien", "assets/sprites/player/alien.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Map
    this.load.tilemapTiledJSON("tilemap", "assets/sprites/map/tilemap.json");

    // Load tileset images
    this.load.image("gras", "assets/sprites/world/ground/gras.png");
    this.load.image("stone", "assets/sprites/world/obstacles/stone.png");
  }

  create() {
    const self = this;
    this.otherPlayers = {};

    // Create Player in Scene
    socket.emit("getplayerobjectlist");
    socket.on("playerobjectlist", (playerlist, pt) => {
      this.pt = pt; // Store the player template
      Object.keys(playerlist).forEach((id) => {
        if (playerlist[id].playerId === socket.id) {
          if (!self.player) {
            self.addPlayer(playerlist[id], pt); // Adding the current player if not already added
          }
        } else {
          if (!self.otherPlayers[playerlist[id].playerId]) {
            self.addOtherPlayer(playerlist[id], pt); // Adding other players if not already added
          }
        }
      });
    });

    // Add Map to the Game
    const map = this.make.tilemap({ key: "tilemap" });

    // Add tilesets
    const grasTileset = map.addTilesetImage("gras");
    const stoneTileset = map.addTilesetImage("stone");

    // Create layers
    this.groundLayer = map.createLayer("ground", grasTileset, 0, 0);
    this.obstacleLayer = map.createLayer("obstacles", stoneTileset, 0, 0);

    // Define World Bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Set collision for obstacle layer
    this.obstacleLayer.setCollisionByExclusion([-1]);

    // Listen for current players update
    socket.on("currentPlayers", (players) => {
      // Remove players that are no longer connected
      Object.keys(this.otherPlayers).forEach((id) => {
        if (!players[id]) {
          this.otherPlayers[id].destroy();
          delete this.otherPlayers[id];
        }
      });

      // Add or update players
      Object.keys(players).forEach((id) => {
        if (players[id].playerId === socket.id) {
          if (!this.player) {
            this.addPlayer(players[id], this.pt); // Add current player if not already added
          }
        } else {
          if (!this.otherPlayers[players[id].playerId]) {
            this.addOtherPlayer(players[id], this.pt); // Add other players if not already added
          } else {
            // Update existing players
            this.otherPlayers[players[id].playerId].x = players[id].x;
            this.otherPlayers[players[id].playerId].y = players[id].y;
          }
        }
      });
    });

    // Emit player movement to server
    socket.on("playerMoved", (data) => {
      if (data.playerId !== socket.id) {
        const otherPlayer = this.otherPlayers[data.playerId];
        if (otherPlayer) {
          otherPlayer.x = data.x;
          otherPlayer.y = data.y;
          otherPlayer.anims.play(data.animation, true);
        }
      }
    });

    if (this.showDebugText) {
      this.debugtext = this.add.text(0, 0, '-');
    }
  }

  update() {
    if (this.inputmanager && this.player) {
      this.inputmanager.updatePlayerMovement();
      this.playerText.setPosition(
        this.player.x,
        this.player.y - this.player.height / 3
      );
    }

    if (this.player && this.obstacleLayer) {
      this.physics.add.collider(this.player, this.obstacleLayer);
      this.player.body.updateBounds();
    }

    if (this.showDebugText && this.player) {
      this.debugtext.setText([
        'Player:',
        '',
        JSON.stringify(
            Phaser.Utils.Objects.Pick(this.player.body, [ 'blocked', 'touching', 'embedded' ]),
            null,
            2
        )
      ]);
    }
  }

  addPlayer(playerData, pt) {
    const playerTemplateId = playerData.playertemplateid;
    const spriteKey = pt["race"][playerTemplateId];
    this.player = this.physics.add.sprite(200, 200, spriteKey);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1, 1);

    // Create and position the player's name text
    this.playerText = this.add.text(
      this.player.x,
      this.player.y - this.player.height / 2 - 10, // Adjusted position above the player sprite
      playerData.playername,
      {
        fill: "#fff",
      }
    );
    this.playerText.setOrigin(0.5, 1); // Set origin to center bottom

    this.inputmanager = new inputmanager(this, spriteKey);
    this.camermanager = new cameramanager(this);
    this.camermanager.cameraFollow(this.player);

    // Add a collider for every other player object to the player you have just created
    Object.keys(this.otherPlayers).forEach((id) => {
        this.physics.add.collider(this.player, this.otherPlayers[id]);  // Important so that the collision with other players happens and "Immovable" is evaluated on other players
    });

    // Emit player movement to server
    this.input.on("pointermove", (pointer) => {
      socket.emit("playerMoved", { x: pointer.x, y: pointer.y });
    });
  }

  addOtherPlayer(playerData, pt) {
    const playerTemplateId = playerData.playertemplateid;
    const otherPlayer = this.physics.add.sprite(
      playerData.x, // Use the data sent from the server
      playerData.y, // Use the data sent from the server
      pt["race"][playerTemplateId]
    );
    otherPlayer.setCollideWorldBounds(true);
    otherPlayer.body.setImmovable(true);  // Important so that other players can block the player object
    otherPlayer.setScale(1, 1);

    // Add the other player to a list to keep track of them
    this.otherPlayers[playerData.playerId] = otherPlayer;

    console.log("other player was created: " + playerData.playerId);

    if (this.player) {
      this.physics.add.collider(this.player, this.otherPlayers[playerData.playerId]);  // Important so that the collision with other players happens and "Immovable" is evaluated on other players
    }
  }
}
