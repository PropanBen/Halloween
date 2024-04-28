class inputmanager {
    constructor(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.velocity = 200;

        // Create animations
        scene.anims.create({
            key: 'walk_down',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'walk_up',
            frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'walk_left',
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'walk_right',
            frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
    }

    updatePlayerMovement() {
        const { cursors, velocity } = this;
        const player = this.scene.player;

     if (cursors.left.isDown) {
        player.setVelocityX(-velocity);
    } else if (cursors.right.isDown) {
        player.setVelocityX(velocity);
    } else {
        player.setVelocityX(0);
    }
  
    if (cursors.up.isDown) {
        player.setVelocityY(-velocity);
    } else if (cursors.down.isDown) {
        player.setVelocityY(velocity);
    } else {
        player.setVelocityY(0);
    }
  
    // Play animations based on direction
    if (cursors.left.isDown && cursors.up.isDown) {
        player.anims.play('walk_left', true);
    } else if (cursors.right.isDown && cursors.up.isDown) {
        player.anims.play('walk_right', true);
    } else if (cursors.left.isDown && cursors.down.isDown) {
        player.anims.play('walk_left', true);
    } else if (cursors.right.isDown && cursors.down.isDown) {
        player.anims.play('walk_right', true);
    } else if (cursors.left.isDown) {
        player.anims.play('walk_left', true);
    } else if (cursors.right.isDown) {
        player.anims.play('walk_right', true);
    } else if (cursors.up.isDown) {
        player.anims.play('walk_up', true);
    } else if (cursors.down.isDown) {
        player.anims.play('walk_down', true);
    } else {
        player.anims.stop();
    }

    }
}


