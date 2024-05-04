import { GameScene } from "../scenes/gameScene";

export class CameraManager {
    constructor(protected scene: GameScene) {
        this.scene.input.on("wheel", this.handleMouseWheel, this);
        this.scene.input.on("pointerdown", this.handlePointerDown, this);
    }

    public handleMouseWheel(
        _pointer: Phaser.Input.Pointer,
        _gameObjects: never,
        _deltaX: number,
        deltaY: number,
        _deltaZ: number,
    ) {
        const zoomAmount = deltaY * -0.001;
        let zoom = this.scene.cameras.main.zoom + zoomAmount;
        zoom = Phaser.Math.Clamp(zoom, 0.1, 3);
        this.scene.cameras.main.setZoom(zoom);
    }

    public handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (pointer.middleButtonDown()) {
            const defaultZoom = 1.5;
            this.scene.cameras.main.setZoom(defaultZoom);
        }
    }

    public cameraFollow(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        this.scene.cameras.main.startFollow(player, false, 1, 1, 0, 0);
    }
}
