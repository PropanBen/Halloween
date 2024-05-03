import { Socket } from "socket.io-client";

import { ClientToServerEvents, Player, ServerToClientEvents } from "shared";

export class PlayerList {
    protected currentPlayers: Map<string, Player> = new Map();
    protected listeners: Map<Symbol, Function> = new Map();

    get players() {
        return this.currentPlayers;
    }

    constructor(protected socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
        this.registerEvents();
    }

    protected registerEvents() {
        this.socket.on("players_update", players => (this.players = new Map(Object.entries(players))));
        this.socket.on("player_login", this.addPlayer.bind(this));
        this.socket.on("player_logout", this.removePlayer.bind(this));
    }

    protected updatePlayerList() {
        this.listeners.forEach(listener => listener());
    }

    public set players(players: Map<string, Player>) {
        this.currentPlayers = players;
        this.updatePlayerList();
    }

    public removePlayer(id: string) {
        this.currentPlayers.delete(id);
        this.updatePlayerList();
    }

    public addPlayer(player: Player) {
        this.currentPlayers.set(player.id, player);
        this.updatePlayerList();
    }

    public addListener(listener: Function): Symbol {
        const id = Symbol();
        this.listeners.set(id, listener);
        return id;
    }

    public removeListener(id: Symbol) {
        this.listeners.delete(id);
    }
}
