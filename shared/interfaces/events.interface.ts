import { DataUpdate, DataMove } from './data.interface';

export interface ServerToClientEvents {
	ping: (n: number) => void;
	pong_accept: (playerId: number) => void;
	pong_update: (data: DataUpdate) => void;
	setStateOnline: () => void;
}

export interface ClientToServerEvents {
	ping: (n: number) => void;
	pong_join: (id: number) => void;
	pong_move: (direction: number) => void;
	pong_refresh: () => void;
}
