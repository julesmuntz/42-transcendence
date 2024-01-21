import { Injectable } from '@nestjs/common';
import {
	ballReset,
	pingReset,
	playerLeftReset,
	playerRightReset,
} from '../shared/config/pong.config';
import { DataUpdate } from '../shared/interfaces/data.interface';
import { Socket } from 'socket.io';
import { GamesService } from '../games/games.service';
import { GameDto } from '../games/dto/game.dto';

interface DataIds {
	id1: number;
	id2: number;
}

interface Presence {
	present1: number;
	present2: number;
}

@Injectable()
export class PongService {
	constructor(private gamesService: GamesService) {}
	private room: Map<string, string> = new Map<string, string>();
	private room_data: Map<string, DataUpdate> = new Map<string, DataUpdate>();
	private room_properties: Map<string, DataIds> = new Map<string, DataIds>();
	private presence: Map<string, Presence> = new Map<string, Presence>();
	private playerId: Map<string, number> = new Map<string, number>();
	private current_room: string = '';

	gameStart(): boolean {
		return (this.current_room === '');
	}

	isInGame(client: Socket): boolean {
		return (this.room.has(client.id));
	}

	isFirstPlayer(client: Socket): boolean {
		return (this.playerId.get(client.id) === 1);
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

	joinGame(client: Socket, id: number): number {
		if (this.current_room === '') {
			this.current_room = 'game_' + (Math.random() + 1).toString(36).substring(7);
			this.presence.set(this.current_room, { present1: 0, present2: 0 });
			this.room_data.set(this.current_room, {
				t: { update: new Date(), kickoff: new Date() },
				ping: { ...pingReset },
				player1: { ...playerLeftReset },
				player2: { ...playerRightReset },
				ball: { ...ballReset },
			});
			this.room_properties.set(this.current_room, { id1: id, id2: -1 });
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			var pres = this.presence.get(this.current_room);
			pres.present1 += 1;
			this.presence.set(this.current_room, pres);
			this.playerId.set(this.current_room, 1);
			return (1);
		}
		else {
			const id1 = this.room_properties.get(this.current_room).id1;
			this.room_properties.set(this.current_room, { id1: id1, id2: id});
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			var pres = this.presence.get(this.current_room);
			pres.present2 += 1;
			this.presence.set(this.current_room, pres);
			this.playerId.set(this.current_room, 2);
			this.current_room = '';
			return (2);
		}
	}

	kick(client: Socket): void {
		const roomName = this.room.get(client.id);
		const playerId = this.playerId.get(client.id);
		const pres = this.presence.get(roomName);
		if (playerId === 1)
			pres.present1 -= 1;
		else
			pres.present2 -= 1;
		this.room.delete(client.id);
		this.playerId.delete(client.id);
		if (pres.present1 === 0 && pres.present2 === 0) {
			this.room_properties.delete(roomName);
			this.presence.delete(roomName);
			this.room_data.delete(roomName);
		}
		if (this.current_room === roomName
			&& ((playerId === 1 && pres.present1 === 0)
				|| (playerId === 2 && pres.present2 === 0)))
			this.current_room = '';
		this.presence.set(roomName, pres);
	}

	registerResults(client: Socket): void {
		const data: DataUpdate = this.getData(client);
		const roomName: string = this.room.get(client.id);
		const room_properties = this.room_properties.get(roomName);
		const game = new GameDto();
		game.user1Id = room_properties.id1;
		game.user2Id = room_properties.id2;
		game.score1 = data.player1.score;
		game.score2 = data.player2.score;
		this.gamesService.create(game);
	}
}
