import { GameScene } from "../scenes/gameScene";

export class InputManager {
    protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected velocity = 200;

    constructor(protected scene: GameScene) {
        this.cursors = scene.input.keyboard?.createCursorKeys();

        scene.anims.create({
            key: "walk_down",
            frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        scene.anims.create({
            key: "walk_up",
            frames: scene.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
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

    public updatePlayerMovement() {
        if (this.cursors?.left.isDown) {
            this.scene.player?.setVelocityX(-this.velocity);
        } else if (this.cursors?.right.isDown) {
            this.scene.player?.setVelocityX(this.velocity);
        } else {
            this.scene.player?.setVelocityX(0);
        }

        if (this.cursors?.up.isDown) {
            this.scene.player?.setVelocityY(-this.velocity);
        } else if (this.cursors?.down.isDown) {
            this.scene.player?.setVelocityY(this.velocity);
        } else {
            this.scene.player?.setVelocityY(0);
        }
        // Play animations based on direction
        if (this.cursors?.left.isDown && this.cursors?.up.isDown) {
            this.scene.player?.anims.play("walk_left", true);
        } else if (this.cursors?.right.isDown && this.cursors?.up.isDown) {
            this.scene.player?.anims.play("walk_right", true);
        } else if (this.cursors?.left.isDown && this.cursors?.down.isDown) {
            this.scene.player?.anims.play("walk_left", true);
        } else if (this.cursors?.right.isDown && this.cursors?.down.isDown) {
            this.scene.player?.anims.play("walk_right", true);
        } else if (this.cursors?.left.isDown) {
            this.scene.player?.anims.play("walk_left", true);
        } else if (this.cursors?.right.isDown) {
            this.scene.player?.anims.play("walk_right", true);
        } else if (this.cursors?.up.isDown) {
            this.scene.player?.anims.play("walk_up", true);
        } else if (this.cursors?.down.isDown) {
            this.scene.player?.anims.play("walk_down", true);
        } else {
            this.scene.player?.anims.stop();
        }
    }
}
