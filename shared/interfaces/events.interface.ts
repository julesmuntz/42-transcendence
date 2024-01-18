import { DataUpdate, DataMove } from './data.interface';

export interface ServerToClientEvents {
	accept: (playerId: number) => void;
	ping: (n: number) => void;
	update: (data: DataUpdate) => void;
}

export interface ClientToServerEvents {
	join: () => void;
	ping: (n: number) => void;
	move: (direction: number) => void;
	refresh: () => void;
}
