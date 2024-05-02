// Define menuscene
class menuscene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuscene' });
    }

    preload() {

 
        this.load.spritesheet('player', 'assets/sprites/player/player.png', { frameWidth: 64, frameHeight: 64 });

    }

    create() {

    
            this.playerText = this.add.text(20, 20, 'Connected Players :', { fill: '#fff' });

            this.socket = io();

            this.socket.on('playertemplate', (playertemplate) => {
                console.log(playertemplate);
              });
            
   
            //Get Current Players
            this.socket.on('currentPlayers', (playerList) => {
            const playerNames = Object.values(playerList).map(player => player.playername);
            this.playerText.setText('Connected Players: ' + playerNames.join(', '));
            });
   
        
            // Create input field for username
            const gameCanvas = document.getElementById('gameCanvas');
        
            const usernameInput = document.createElement('input');
            usernameInput.type = 'text';
            usernameInput.name = 'username';
            usernameInput.placeholder = 'Enter your name';
            usernameInput.style.fontSize = '20px';
            usernameInput.style.padding = '10px';
        
            gameCanvas.appendChild(usernameInput);
        
            // Button to submit username
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.style.fontSize = '20px';
            submitButton.style.padding = '10px';
            submitButton.style.marginTop = '10px';
        
            submitButton.addEventListener('click', () => {
                const username = usernameInput.value;
                if (username.trim() !== '') {
                    this.socket.emit('set_username', username);
                    usernameInput.style.display = 'none';
                    submitButton.style.display = 'none';
                }
            });
        
            gameCanvas.appendChild(submitButton);

  
            // Add a button to switch to the GameScene
            const button = this.add.text(400, 400, 'Start Game', { fill: '#0f0' }).setInteractive();
            button.on('pointerdown', () => {
                this.scene.start('gamescene'); // Replace 'gamescene' with your actual key for the GameScene
            });
        }
        
    
    

    update() {

    }


}
