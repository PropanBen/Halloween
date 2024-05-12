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
    const self = this;
    this.otherPlayers = {};

    // Create Player in Scene
    socket.emit("getplayerobjectlist");
    socket.on("playerobjectlist", (playerlist, pt) => {
      Object.keys(playerlist).forEach((id) => {
        if (playerlist[id].playerId === socket.id) {
          self.addPlayer(playerlist[id], pt); // Adding the current player
        } else {
          self.addOtherPlayer(playerlist[id], pt); // Adding other players
        }
      });
    });

    // Add Map to the Game
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
    obstacleLayer.setCollisionByExclusion([-1]);
  }

  update() {
    if (this.inputmanager && this.player) {
      this.inputmanager.updatePlayerMovement();
    }
  }

  addPlayer(playerData, pt) {
    const playerTemplateId = playerData.playertemplateid;
    const spriteKey = pt["race"][playerTemplateId];
    this.player = this.physics.add.sprite(
      playerData.x,
      playerData.y,
      pt["race"][playerTemplateId]
    );
    this.physics.world.enable(this.player);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1, 1);

    this.inputmanager = new inputmanager(this, spriteKey, socket.id);

    // Emit player movement to server
    this.input.on("pointermove", (pointer) => {
      socket.emit("playerMoved", { x: pointer.x, y: pointer.y });
    });

    // Listen for other players' movements
    socket.on("playerMoved", (data) => {
      if (data.playerId !== socket.id) {
        //  console.log(data);
        // Skip updating own player
        const otherPlayer = this.otherPlayers[data.playerId];
        console.log(otherPlayer);
        if (otherPlayer) {
          otherPlayer.x = data.x;
          otherPlayer.y = data.y;
        }
      }
    });
  }

  addOtherPlayer(playerData, pt) {
    const playerTemplateId = playerData.playertemplateid;
    const otherPlayer = this.physics.add.sprite(
      playerData.x, // Use the data sent from the server
      playerData.y, // Use the data sent from the server
      pt["race"][playerTemplateId]
    );
    this.physics.world.enable(otherPlayer);
    otherPlayer.setCollideWorldBounds(true);
    otherPlayer.setScale(1, 1);

    // Add the other player to a list to keep track of them
    this.otherPlayers[playerData.playerId] = otherPlayer;
  }
}
