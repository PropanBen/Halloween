import { Player } from "./player";
import { PlayerTemplate } from "./playerTemplates";

export interface ServerToClientEvents {
    players_update: (players: Record<string, Player>) => void;
    player_login: (player: Player) => void;
    player_logout: (playerId: string) => void;
    player_request_username: (playerId: string) => void;
    playertemplates_update: (playerTemplate: PlayerTemplate) => void;
}

export interface ClientToServerEvents {
    player_set_username: (username: string) => void;
}
