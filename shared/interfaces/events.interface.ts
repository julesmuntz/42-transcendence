import { DataUpdate, DataMove } from './data.interface';

export interface ServerToClientEvents {
	ping: (n: number) => void;
	pong_accept: (playerId: number) => void;
	pong_update: (data: DataUpdate) => void;
}

export interface ClientToServerEvents {
	ping: (n: number) => void;
	pong_join: () => void;
	pong_move: (direction: number) => void;
	pong_refresh: () => void;
}
