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
    this.load.spritesheet("werewolf", "assets/sprites/player/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("ghost", "assets/sprites/player/player.png", {
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
    let races = null;
    let race = null;

    socket.emit("getplayertemplates");
    socket.on("playerstemplates", (playertemplate) => {
      races = playertemplate;
    });

    socket.emit("getplayerlist");
    socket.on("players", (players) => {
      race = races["race"][players[socket.id].playertemplateid];
      console.log(race);
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

    // Player

    this.player = this.physics.add.sprite(800, 200, "player");
    this.physics.world.enable(this.player);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1, 1);
    this.physics.add.collider(this.player, obstacleLayer);

    // Collide player with obstacle layer
    this.physics.add.collider(this.player, obstacleLayer);

    this.inputmanager = new inputmanager(this);
    this.cameramanager = new cameramanager(this);

    //Camera
    this.cameramanager = new cameramanager(this);
    this.cameramanager.cameraFollow(this.player);
  }

  update() {
    this.inputmanager.updatePlayerMovement();
  }
}
