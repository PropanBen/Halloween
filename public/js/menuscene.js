// Define menuscene
class menuscene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuscene' });
    }

    preload() {
        // Preload assets specific to menuscene
    }

    create(data) {
        // Establish socket connection
        this.socket = io();

        // Create a text object to display connected players
        this.playerText = this.add.text(20, 20, 'Connected Players: ', { fill: '#fff' });

        // Initialize player list
        this.playerList = {};

        // Listen for socket events
        this.socket.on('currentPlayers', (players) => {
            this.playerList = players;
        });

        this.socket.on('newPlayer', (player) => {
            this.playerList[player.playerId] = player;
        });

        this.socket.on('logout', (playerId) => {
            delete this.playerList[playerId];
        });

          // Add a button to switch to the GameScene
    const button = this.add.text(400, 300, 'Start Game', { fill: '#0f0' }).setInteractive();
    button.on('pointerdown', () => {
        this.scene.start('gamescene'); // Replace 'gamescene' with your actual key for the GameScene
    });

 
    }

    update() {
        // Update player list text
        const playerID = Object.values(this.playerList).map(player => player.playerId);
        this.playerText.setText('Connected Players: ' + playerID.join(', '));
    }
}


