import { Scene } from "phaser";

import { Player } from "shared";
import { PlayerList } from "./playerList.ts";

export class PlayerDisplay {
    protected playerListText: Phaser.GameObjects.Text;

    constructor(
        protected scene: Scene,
        protected playerList: PlayerList,
        protected position: { x: number; y: number } = { x: 20, y: 20 },
    ) {
        this.playerListText = this.createPlayerListText();
        this.playerList.addListener(() => this.updatePlayerList());
    }

    protected createPlayerListText(): Phaser.GameObjects.Text {
        return this.scene.add.text(this.position.x, this.position.y, `Connected Players ${this.formatPlayerList()}`, {
            fontFamily: "Arial",
            fontSize: 16,
            color: "white",
        });
    }

    protected formatPlayerList(): string {
        return [...this.playerList.players.values()].map((player: Player) => player.username).join(", ");
    }

    protected updatePlayerList() {
        this.playerListText.setText(`Connected Players ${this.formatPlayerList()}`);
    }
}
