class menuscene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuscene' });
    }

    preload() {
        // Preload assets specific to UIScene
    }

    create() {
      
            // Create a button
            const button = this.add.text(400, 300, 'Start Game', { fill: '#0f0' })
                .setInteractive()
                .on('pointerdown', () => this.startGame());
    
            // Center the button
            button.setOrigin(0.5);
        }
    
        startGame() {
            // Switch to the GameScene
            this.scene.start('gamescene');
        
    }

    update() {
        // Update logic for UIScene
    }
}

