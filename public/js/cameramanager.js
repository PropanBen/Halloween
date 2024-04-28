class cameramanager {
    constructor(scene) {
        this.scene = scene;
        this.scene.input.on('wheel', this.handleMouseWheel, this);
        this.scene.input.on('pointerdown', this.handlePointerDown, this);
    }

    handleMouseWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
        const zoomAmount = deltaY * -0.001;
        let zoom = this.scene.cameras.main.zoom + zoomAmount;
        zoom = Phaser.Math.Clamp(zoom, 0.1, 3);
        this.scene.cameras.main.setZoom(zoom);
    }

    handlePointerDown(pointer) {
        if (pointer.middleButtonDown()) {
            const defaultZoom = 1.5;
            this.scene.cameras.main.setZoom(defaultZoom);
        }
    }

    cameraFollow(player) {
        this.scene.cameras.main.startFollow(player, false, 1, 1, 0, 0);
    }
}


