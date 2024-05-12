class inputmanager {
  constructor(scene, spriteKey, playerID) {
    this.scene = scene;
    this.spriteKey = spriteKey;
    this.playerID = playerID; // Store playerID as a property

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.velocity = 200;

    this.createAnimations();
    this.updatePlayerMovement();

    // Listen for player movement updates from the server
    socket.on("playerMovement", (data) => {
      if (data.playerId !== this.playerID) {
        const otherPlayer = this.scene.otherPlayers[data.playerId];
        if (otherPlayer) {
          otherPlayer.x = data.x;
          otherPlayer.y = data.y;
          otherPlayer.anims.play(data.animation, true);
        }
      }
    });

    socket.on("playerAnimated", (animationData) => {
      const otherPlayer = this.scene.otherPlayers[animationData.playerId];
      if (otherPlayer) {
        otherPlayer.anims.play(animationData.animation, true);
      }
    });
  }

  createAnimations() {
    const { scene, spriteKey, playerID } = this;

    this.idleAnimationKey = "idle_" + playerID;
    this.walkDownAnimationKey = "walk_down_" + playerID;
    this.walkUpAnimationKey = "walk_up_" + playerID;
    this.walkLeftAnimationKey = "walk_left_" + playerID;
    this.walkRightAnimationKey = "walk_right_" + playerID;

    // Create animations
    if (!scene.anims.exists(this.idleAnimationKey)) {
      scene.anims.create({
        key: this.idleAnimationKey,
        frames: scene.anims.generateFrameNumbers(spriteKey, {
          start: 0,
          end: 0,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.walkDownAnimationKey)) {
      scene.anims.create({
        key: this.walkDownAnimationKey,
        frames: scene.anims.generateFrameNumbers(spriteKey, {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.walkUpAnimationKey)) {
      scene.anims.create({
        key: this.walkUpAnimationKey,
        frames: scene.anims.generateFrameNumbers(spriteKey, {
          start: 12,
          end: 15,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.walkLeftAnimationKey)) {
      scene.anims.create({
        key: this.walkLeftAnimationKey,
        frames: scene.anims.generateFrameNumbers(spriteKey, {
          start: 4,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.walkRightAnimationKey)) {
      scene.anims.create({
        key: this.walkRightAnimationKey,
        frames: scene.anims.generateFrameNumbers(spriteKey, {
          start: 8,
          end: 11,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  updatePlayerMovement() {
    const { keys, velocity } = this;
    const player = this.scene.player;

    if (!player) {
      console.log("returns");
      return; // Return early if player is not initialized
    }

    if (keys.left.isDown) {
      player.setVelocityX(-velocity);
    } else if (keys.right.isDown) {
      player.setVelocityX(velocity);
    } else {
      player.setVelocityX(0);
    }

    if (keys.up.isDown) {
      player.setVelocityY(-velocity);
    } else if (keys.down.isDown) {
      player.setVelocityY(velocity);
    } else {
      player.setVelocityY(0);
    }

    // Play animations based on direction
    if (keys.left.isDown && keys.up.isDown) {
      player.anims.play(this.walkLeftAnimationKey, true);
    } else if (keys.right.isDown && keys.up.isDown) {
      player.anims.play(this.walkRightAnimationKey, true);
    } else if (keys.left.isDown && keys.down.isDown) {
      player.anims.play(this.walkLeftAnimationKey, true);
    } else if (keys.right.isDown && keys.down.isDown) {
      player.anims.play(this.walkRightAnimationKey, true);
    } else if (keys.left.isDown) {
      player.anims.play(this.walkLeftAnimationKey, true);
    } else if (keys.right.isDown) {
      player.anims.play(this.walkRightAnimationKey, true);
    } else if (keys.up.isDown) {
      player.anims.play(this.walkUpAnimationKey, true);
    } else if (keys.down.isDown) {
      player.anims.play(this.walkDownAnimationKey, true);
    } else {
      player.anims.play(this.idleAnimationKey, true);
    }

    // Emit player movement data to the server
    socket.emit("playerMovement", {
      playerId: this.playerID,
      x: player.x,
      y: player.y,
      animation: player.anims.currentAnim.key,
    });

    socket.emit("playerAnimation", { animation: player.anims.currentAnim.key });
  }

  updateSpriteKey(key) {
    this.spriteKey = key;
  }

  updateSocketId(id) {
    this.playerID = id;
  }
}
