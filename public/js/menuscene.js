class menuscene extends Phaser.Scene {
  constructor() {
    super({ key: "menuscene" });
  }

  preload() {}
  create() {
    let currentRaceIndex = 0;
    const races = [];
    let currentImage = null;
    let playerobjectlist = {};

    socket.emit("getplayerlist");
    socket.on("currentPlayers", (players) => {
      let playerNames = Object.values(players)
        .map((player) => player.playername)
        .join(", ");
      this.playerText.setText("Connected Players: " + playerNames);
    });

    this.playerText = this.add.text(20, 20, "Connected Players :", {
      fill: "#fff",
    });

    socket.on("playertemplate", (playertemplate) => {
      races.length = 0;
      for (let key in playertemplate.race) {
        if (playertemplate.race.hasOwnProperty(key)) {
          races.push(playertemplate.race[key]);
        }
      }
      if (!currentImage) {
        currentImage = createImageObject(400, 200, races[0]);
        createLeftButton();
        createRightButton();
      } else {
        currentImage.src = "assets/sprites/player/" + races[0] + ".png";
      }
    });

    function createImageObject(x, y, imageName) {
      // Erstelle das Bildobjekt
      const image = document.createElement("img");
      const playerLabel = document.createElement("label");
      playerLabel.textContent = "Wähle deine Spielfigur";
      image.id = "playerImage";
      image.src = "assets/sprites/player/" + imageName + ".png";

      // Füge das Bildobjekt zum playerContainer hinzu
      playerContainer.appendChild(image);
      playerContainer.appendChild(playerLabel);

      // Rückgabe des Bildobjekts
      return image;
    }

    //Menu

    // Create Elements for the Menu
    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";
    menuContainer.style.textAlign = "center";

    const nameLabel = document.createElement("label");
    nameLabel.id = "nameLabel";
    nameLabel.textContent = "Gib deinen Namen ein";
    const nameInput = document.createElement("input");
    nameInput.type = "text";

    const nameButton = document.createElement("button");
    nameButton.id = "nameButton";
    nameButton.textContent = "Absenden";

    menuContainer.appendChild(nameLabel);
    menuContainer.appendChild(document.createElement("br"));
    menuContainer.appendChild(nameInput);
    menuContainer.appendChild(document.createElement("br"));
    menuContainer.appendChild(document.createElement("br"));
    menuContainer.appendChild(nameButton);

    // Add Menu to gameCanvas
    gameCanvas.appendChild(menuContainer);

    // Send Username to Server
    nameButton.addEventListener("click", () => {
      const player = {
        playerid: socket.id,
        username: nameInput.value,
        playertemplateid: currentRaceIndex,
      };

      socket.emit("createplayerobject", player);
      menuContainer.style.display = "none";
    });

    // Player Selection
    const playerContainer = document.createElement("div");
    playerContainer.id = "playerContainer";
    menuContainer.appendChild(playerContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContauner";
    playerContainer.appendChild(buttonContainer);

    const leftButton = document.createElement("button");
    function createLeftButton() {
      // Erstelle den linken Button
      leftButton.textContent = "<-";
      leftButton.style.marginRight = "10px";
      leftButton.onclick = function () {
        // Gehe zum vorherigen Rennen
        currentRaceIndex = (currentRaceIndex - 1 + races.length) % races.length;
        updateImage();
      };
    }

    // Füge den linken Button zum menuContainer hinzu
    buttonContainer.appendChild(leftButton);

    const rightButton = document.createElement("button");
    function createRightButton() {
      // Erstelle den rechten Button

      rightButton.textContent = "->";
      rightButton.onclick = function () {
        // Gehe zum nächsten Rennen
        currentRaceIndex = (currentRaceIndex + 1) % races.length;
        updateImage();
      };
    }

    // Füge den rechten Button zum menuContainer hinzu
    buttonContainer.appendChild(rightButton);

    function updateImage() {
      // Aktualisiere das Bild mit dem nächsten Rennen
      currentImage.src =
        "assets/sprites/player/" + races[currentRaceIndex] + ".png";
    }

    socket.on("currentPlayers", (players) => {
      const playerNames = [];
      playerobjectlist = players;

      for (const playerId in players) {
        if (players.hasOwnProperty(playerId)) {
          const player = players[playerId];
          playerNames.push(player.playername);
        }
      }
      const connectedPlayersString = playerNames.join(", ");
      //  this.playerText.setText("Connected Players: " + connectedPlayersString);
    });

    // Add a button to switch to the GameScene
    const button = this.add
      .text(400, 400, "Start Game", { fill: "#0f0" })
      .setInteractive();
    button.on("pointerdown", () => {
      this.scene.start("gamescene");
    });
  }

  update() {}
}

/*

  create() {
    let currentRaceIndex = 0;
    const races = [];

    let currentImage = null;

    this.playerText = this.add.text(20, 20, "Connected Players :", {
      fill: "#fff",
    });

    socket.on("currentPlayers", (players) => {
      const playerNames = [];

      for (const playerId in players) {
        if (players.hasOwnProperty(playerId)) {
          const player = players[playerId];
          playerNames.push(player.playername);
        }
      }
      const connectedPlayersString = playerNames.join(", ");
      //  this.playerText.setText("Connected Players: " + connectedPlayersString);
    });

    socket.on("playertemplate", (playertemplate) => {
      races.length = 0;
      for (let key in playertemplate.race) {
        if (playertemplate.race.hasOwnProperty(key)) {
          races.push(playertemplate.race[key]);
        }
      }
      if (!currentImage) {
        currentImage = createImageObject(400, 200, races[0]);
        createLeftButton();
        createRightButton();
      } else {
        currentImage.src = "assets/sprites/player/" + races[0] + ".png";
      }
    });

    function createImageObject(x, y, imageName) {
      // Erstelle das Bildobjekt
      const image = document.createElement("img");
      const playerLabel = document.createElement("label");
      playerLabel.textContent = "Wähle deine Spielfigur";
      image.id = "playerImage";
      image.src = "assets/sprites/player/" + imageName + ".png";

      // Füge das Bildobjekt zum playerContainer hinzu
      playerContainer.appendChild(image);
      playerContainer.appendChild(playerLabel);

      // Rückgabe des Bildobjekts
      return image;
    }

    //Menu

    // Create Elements for the Menu
    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";
    menuContainer.style.textAlign = "center";

    const nameLabel = document.createElement("label");
    nameLabel.id = "nameLabel";
    nameLabel.textContent = "Gib deinen Namen ein";
    const nameInput = document.createElement("input");
    nameInput.type = "text";

    const nameButton = document.createElement("button");
    nameButton.id = "nameButton";
    nameButton.textContent = "Absenden";

    menuContainer.appendChild(nameLabel);
    menuContainer.appendChild(document.createElement("br"));
    menuContainer.appendChild(nameInput);
    menuContainer.appendChild(document.createElement("br"));
    menuContainer.appendChild(document.createElement("br"));
    menuContainer.appendChild(nameButton);

    // Add Menu to gameCanvas
    gameCanvas.appendChild(menuContainer);

    // Send Username to Server
    nameButton.addEventListener("click", () => {
      const player = {
        playerid: socket.id,
        username: nameInput.value,
        playertemplateid: currentRaceIndex,
      };

      socket.emit("set_username", player);
      menuContainer.style.display = "none";
    });

    // Player Selection
    const playerContainer = document.createElement("div");
    playerContainer.id = "playerContainer";
    menuContainer.appendChild(playerContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContauner";
    playerContainer.appendChild(buttonContainer);

    const leftButton = document.createElement("button");
    function createLeftButton() {
      // Erstelle den linken Button
      leftButton.textContent = "<-";
      leftButton.style.marginRight = "10px";
      leftButton.onclick = function () {
        // Gehe zum vorherigen Rennen
        currentRaceIndex = (currentRaceIndex - 1 + races.length) % races.length;
        updateImage();
      };
    }

    // Füge den linken Button zum menuContainer hinzu
    buttonContainer.appendChild(leftButton);

    const rightButton = document.createElement("button");
    function createRightButton() {
      // Erstelle den rechten Button

      rightButton.textContent = "->";
      rightButton.onclick = function () {
        // Gehe zum nächsten Rennen
        currentRaceIndex = (currentRaceIndex + 1) % races.length;
        updateImage();
      };
    }

    // Füge den rechten Button zum menuContainer hinzu
    buttonContainer.appendChild(rightButton);

    function updateImage() {
      // Aktualisiere das Bild mit dem nächsten Rennen
      currentImage.src =
        "assets/sprites/player/" + races[currentRaceIndex] + ".png";
    }

    // Add a button to switch to the GameScene
    const button = this.add
      .text(400, 400, "Start Game", { fill: "#0f0" })
      .setInteractive();
    button.on("pointerdown", () => {
      this.scene.start("gamescene");
    });
  }

  update() {}
}

*/
