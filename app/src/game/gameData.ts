import { Socket } from "socket.io-client";
import { PlayerList } from "../components/playerList";
import { ClientToServerEvents, ServerToClientEvents } from "shared";

export interface GameData {
    socket: Socket<ServerToClientEvents, ClientToServerEvents>;
    playerList: PlayerList;
}
