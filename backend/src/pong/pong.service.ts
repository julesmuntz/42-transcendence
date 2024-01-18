import { Injectable } from '@nestjs/common';
import {
	ballReset,
	pingReset,
	playerLeftReset,
	playerRightReset,
} from '../shared/config/pong.config';
import { DataIds, DataUpdate } from '../shared/interfaces/data.interface';
import { Socket } from 'socket.io';

@Injectable()
export class PongService {
	private room: Map<string, string> = new Map<string, string>();
	private room_data: Map<string, DataUpdate> = new Map<string, DataUpdate>();
	private room_properties: Map<string, DataIds> = new Map<string, DataIds>();
	private current_room: string = '';

	gameStart(): boolean {
		return (this.current_room === '');
	}

	isInGame(client: Socket): boolean {
		return (this.room.has(client.id));
	}

	isFirstPlayer(client: Socket): boolean {
		const roomName = this.room.get(client.id);
		const props = this.room_properties.get(roomName);
		return (client.id === props.id1);
	}

	getData(client: Socket): DataUpdate {
		const roomName = this.room.get(client.id);
		return (this.room_data.get(roomName));
	}

	setData(client: Socket, data: DataUpdate): void {
		const roomName = this.room.get(client.id);
		this.room_data.set(roomName, data);
	}

	getRoom(client: Socket): string {
		return (this.room.get(client.id));
	}

	joinGame(client: Socket): number {
		if (this.current_room === '') {
			this.current_room = 'game_' + (Math.random() + 1).toString(36).substring(7);
			this.room_data.set(this.current_room, {
				t: { update: new Date(), kickoff: new Date() },
				ping: { ...pingReset },
				player1: { ...playerLeftReset },
				player2: { ...playerRightReset },
				ball: { ...ballReset },
			});
			this.room_properties.set(this.current_room, { id1: client.id, id2: '' });
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			return (1);
		}
		else {
			const id1 = this.room_properties.get(this.current_room).id1;
			this.room_properties.set(this.current_room, { id1: id1, id2: client.id});
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			this.current_room = '';
			return (2);
		}
	}

	kick(client: Socket): void {
		const roomName = this.room.get(client.id);
		const props = this.room_properties.get(roomName);
		this.room.delete(client.id);
		if (client.id === props.id1)
			this.room_properties.set(roomName, { id1: '', id2: props.id2 });
		else
			this.room_properties.set(roomName, { id1: props.id2, id2: '' });
		if (props.id1 === '' && props.id2 === '') {
			this.room_properties.delete(roomName);
			this.room_data.delete(roomName);
		}
		if (this.current_room === roomName)
			this.current_room = '';
	}
}
