class inputmanager {
  constructor(scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.velocity = 200;

    // Create animations
    scene.anims.create({
      key: "walk_down",
      frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk_up",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk_left",
      frames: scene.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk_right",
      frames: scene.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  updatePlayerMovement() {
    const { keys, velocity } = this;
    const player = this.scene.player;

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
      player.anims.play("walk_left", true);
    } else if (keys.right.isDown && keys.up.isDown) {
      player.anims.play("walk_right", true);
    } else if (keys.left.isDown && keys.down.isDown) {
      player.anims.play("walk_left", true);
    } else if (keys.right.isDown && keys.down.isDown) {
      player.anims.play("walk_right", true);
    } else if (keys.left.isDown) {
      player.anims.play("walk_left", true);
    } else if (keys.right.isDown) {
      player.anims.play("walk_right", true);
    } else if (keys.up.isDown) {
      player.anims.play("walk_up", true);
    } else if (keys.down.isDown) {
      player.anims.play("walk_down", true);
    } else {
      player.anims.stop();
    }
  }
}
