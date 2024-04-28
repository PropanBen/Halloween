class playerlist {
    constructor(scene, socket) {
        this.scene = scene;
        this.socket = socket;
        this.playerListText = null;

        this.createPlayerListText();
        this.registerSocketEvents();
    }

    createPlayerListText() {
        this.playerListText = this.scene.add.text(20, 20, '', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
    }

    registerSocketEvents() {
        this.socket.on('currentPlayers', (players) => {
            this.updatePlayerList(players);
        });

        this.socket.on('newPlayer', (player) => {
            this.updatePlayerList(player);
        });

        this.socket.on('disconnect', (playerId) => {
            this.removePlayerFromList(playerId);
        });
    }

    updatePlayerList(players) {
        let playerNames = Object.values(players).map(player => player.playerId);
        this.playerListText.setText('Connected Players: ' + playerNames.join(', '));
    }

    removePlayerFromList(playerId) {
        let currentText = this.playerListText.text;
        let updatedText = currentText.replace(playerId, '');
        this.playerListText.setText(updatedText);
    }
}

