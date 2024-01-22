import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
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
import { User } from '../users/entities/user.entity';
import { UsersService } from "../users/users.service";
import { statusInGame } from "../users/dto/update-user.dto";

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
	constructor(
		private gamesService: GamesService,
		private readonly usersService: UsersService,
		private dataSource:DataSource
	) {}
	private isGameStarting: Map<string, boolean> = new Map<string, boolean>;
	private room: Map<string, string> = new Map<string, string>();
	private room_from_player: Map<number, string> = new Map<number, string>();
	private room_data: Map<string, DataUpdate> = new Map<string, DataUpdate>();
	private room_properties: Map<string, DataIds> = new Map<string, DataIds>();
	private presence: Map<string, Presence> = new Map<string, Presence>();
	private playerId: Map<string, number> = new Map<string, number>();
	private current_room: string = '';

	gameStart(client: Socket): boolean {
		const roomName = this.room.get(client.id);
		if (!this.isGameStarting.has(roomName))
			return (false);
		const result = this.isGameStarting.get(roomName);
		this.isGameStarting.set(roomName, false);
		return (result);
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
		if (this.room_from_player.has(id)) {
			const roomName = this.room_from_player.get(id);
			const room_properties = this.room_properties.get(roomName);
			var playerId;
			var pres = this.presence.get(roomName);
			if (room_properties.id1 === id) {
				playerId = 1;
				pres.present1 += 1;
			}
			else {
				playerId = 2;
				pres.present2 += 1;
			}
			this.presence.set(this.current_room, pres);
			this.room.set(client.id, roomName);
			this.playerId.set(client.id, playerId);
			client.join(roomName);
			return (playerId);
		}
		if (this.current_room === '') {
			this.current_room = 'game_' + (Math.random() + 1).toString(36).substring(7);
			this.isGameStarting.set(this.current_room, false);
			this.presence.set(this.current_room, { present1: 0, present2: 0 });
			this.room_data.set(this.current_room, {
				t: { update: new Date(), kickoff: new Date() },
				ping: { ...pingReset },
				player1: { ...playerLeftReset },
				player2: { ...playerRightReset },
				ball: { ...ballReset },
			});
			this.room_properties.set(this.current_room, { id1: id, id2: -1 });
			this.room_from_player.set(id, this.current_room);
			this.usersService.update(id, statusInGame);
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			var pres = this.presence.get(this.current_room);
			pres.present1 += 1;
			this.presence.set(this.current_room, pres);
			this.playerId.set(client.id, 1);
			return (1);
		}
		else {
			const id1 = this.room_properties.get(this.current_room).id1;
			this.room_properties.set(this.current_room, { id1: id1, id2: id});
			this.room_from_player.set(id, this.current_room);
			this.usersService.update(id, statusInGame);
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			var pres = this.presence.get(this.current_room);
			pres.present2 += 1;
			this.presence.set(this.current_room, pres);
			this.playerId.set(client.id, 2);
			this.isGameStarting.set(this.current_room, true);
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
		this.presence.set(roomName, pres);
		this.room.delete(client.id);
		this.playerId.delete(client.id);
		if (pres.present1 === 0 && pres.present2 === 0) {
			this.room_properties.delete(roomName);
			this.presence.delete(roomName);
			this.room_data.delete(roomName);
		}
		if ((playerId === 1 && pres.present1 === 0)
			|| (playerId === 2 && pres.present2 === 0)) {
			this.room_from_player.delete(playerId);
			this.usersService.endGame(playerId);
			if (this.current_room === roomName)
				this.current_room = '';
		}
	}

	async registerResults(client: Socket): Promise<void> {
		const data: DataUpdate = this.getData(client);
		const roomName: string = this.room.get(client.id);
		const room_properties = this.room_properties.get(roomName);
		const game = new GameDto();
		game.user1Id = room_properties.id1;
		game.user2Id = room_properties.id2;
		game.score1 = data.player1.score;
		game.score2 = data.player2.score;
		this.gamesService.create(game);
		this.room_from_player.delete(room_properties.id1);
		this.room_from_player.delete(room_properties.id2);
		this.usersService.endGame(room_properties.id1);
		this.usersService.endGame(room_properties.id2);
	}
}
