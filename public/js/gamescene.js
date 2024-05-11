class gamescene extends Phaser.Scene {
  constructor() {
    super({ key: "gamescene" });
  }

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

    //Map
    this.load.tilemapTiledJSON("tilemap", "assets/sprites/map/tilemap.json");

    // Load tileset images
    this.load.image("gras", "assets/sprites/world/ground/gras.png");
    this.load.image("stone", "assets/sprites/world/obstacles/stone.png");
  }

  create() {
    // Declare variables to store player template data
    let races = null;
    let race = null;
    let playerList = null;

    socket.on("currentPlayers", (players) => {
      playerList = players;
    });

    // Request player template data from the server
    socket.emit("getplayertemplates");

    // Listen for player template data from the server
    socket.on("playerstemplates", (playertemplate) => {
      races = playertemplate;

      // Once player template data is received, request player list
      socket.emit("getplayerlist");
    });

    // Listen for player list from the server
    socket.on("players", (players) => {
      // Retrieve the player's race from the player template data
      race = races["race"][players[socket.id].playertemplateid];
      playerList = players;

      // Create the player sprite using the received race data
      this.player = this.physics.add.sprite(800, 200, race);
      this.physics.world.enable(this.player);
      this.player.setCollideWorldBounds(true);
      this.player.setScale(1, 1);

      // Create input manager with the sprite key of the player template
      this.inputmanager = new inputmanager(this, race, socket.id);

      // Set collision with obstacle layer
      this.physics.add.collider(this.player, obstacleLayer);

      this.cameramanager = new cameramanager(this);
      this.cameramanager.cameraFollow(this.player);
    });

    const map = this.make.tilemap({ key: "tilemap" });

    // Add tilesets
    const grasTileset = map.addTilesetImage("gras");
    const stoneTileset = map.addTilesetImage("stone");

    // Create layers
    const groundLayer = map.createLayer("ground", grasTileset, 0, 0);
    const obstacleLayer = map.createLayer("obstacles", stoneTileset, 0, 0);

    // Define World Bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Set collision for obstacle layer
    obstacleLayer.setCollisionByExclusion([-1]); // Collide with all tiles except those with index -1

    socket.on("playerMoved", function (movementData) {
      // Update the position and animation of other players based on received data
      if (movementData && movementData.playerId !== socket.id) {
        const otherPlayer = playerList && playerList[movementData.playerId];
        if (otherPlayer) {
          console.log("otherPlayer:", otherPlayer);
          if (otherPlayer.anims && otherPlayer.anims.play) {
            if (otherPlayer.anims.exists(movementData.animation)) {
              otherPlayer.anims.play(movementData.animation, true);
              otherPlayer.x = movementData.x;
              otherPlayer.y = movementData.y;
            } else {
              console.error(
                "Animation",
                movementData.animation,
                "doesn't exist for player:",
                otherPlayer
              );
            }
          } else {
            console.error("Invalid animation data for player:", otherPlayer);
          }
        } else {
          console.error(
            "Player data not found for playerId:",
            movementData.playerId
          );
        }
      }
    });
  }

  update() {
    if (this.inputmanager && this.player) {
      // Call the updatePlayerMovement method of inputmanager
      this.inputmanager.updatePlayerMovement();
    }
  }
}
