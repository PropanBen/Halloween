class gamescene extends Phaser.Scene {


    constructor() {
        super({ key: 'gamescene' });
    }

    preload() {
        this.load.image('background', 'assets/sprites/world/background.png');
        this.load.spritesheet('player', 'assets/sprites/player/player.png', { frameWidth: 64, frameHeight: 64 });
     
      //Map
      this.load.tilemapTiledJSON('tilemap', 'assets/sprites/map/tilemap.json');
    
      // Load tileset images
      this.load.image('gras', 'assets/sprites/world/ground/gras.png');
      this.load.image('stone', 'assets/sprites/world/obstacles/stone.png');
    
    
    
    }

    create() {
        this.socket = io();
    //Screensize Config überschreiben
    var canvasWidth = document.getElementById("gameCanvas").clientWidth;
    var canvasHeight = document.getElementById("gameCanvas").clientHeight;
    config.width = canvasWidth;
    config.height = canvasHeight;


    //Map   
    var map = this.make.tilemap({ key: 'tilemap' });

    // Add tilesets
    var grasTileset = map.addTilesetImage('gras');
    var stoneTileset = map.addTilesetImage('stone');
  
    // Create layers
    var groundLayer = map.createLayer('ground', grasTileset, 0, 0);
    var obstacleLayer = map.createLayer('obstacles', stoneTileset, 0, 0);

    // Define World Bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Set collision for obstacle layer
    obstacleLayer.setCollisionByExclusion([-1]); // Collide with all tiles except those with index -1
  

    // Player
    this.player = this.physics.add.sprite(800, 200, 'player');
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
