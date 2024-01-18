import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '../shared/interfaces/events.interface';
import { DataIds, DataMove, DataUpdate } from '../shared/interfaces/data.interface';
import { Server, Socket } from 'socket.io'
import {
	ballReset,
	pingReset,
	playerLeftReset,
	playerRightReset,
	playerSpeed,
} from '../shared/config/pong.config';
import {
	ballInteraction,
	launchBall,
	reflectBall,
	updateData
} from '../shared/functions/game';

@WebSocketGateway(8001, { cors: true })
export class PongGateway {
	@WebSocketServer()
	public server: Server;
	private room: Map<string, string> = new Map<string, string>();
	private room_data: Map<string, DataUpdate> = new Map<string, DataUpdate>();
	private room_properties: Map<string, DataIds> = new Map<string, DataIds>();
	private current_room: string = '';

	@SubscribeMessage('disconnected')
	handleEventDisconnected(
		@ConnectedSocket() client: Socket
	): void {
		if (!this.room.has(client.id))
			return ;
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

	@SubscribeMessage('ping')
	handleEventPing(
		@MessageBody() n: number,
		@ConnectedSocket() client: Socket
	): void {
		client.emit('ping', n);
	}

	@SubscribeMessage('move')
	handleEventMove(
		@MessageBody() direction: number,
		@ConnectedSocket() client: Socket
	): void {
		if (!this.room.has(client.id))
			return ;
		const roomName = this.room.get(client.id);
		const props = this.room_properties.get(roomName);
		var data = this.room_data.get(roomName);
		const player = (client.id === props.id1) ? data.player1 : data.player2;
		const newSpeed = playerSpeed * Math.sign(direction);

		updateData(data);
		player.vy = newSpeed;
		this.room_data.set(roomName, data);
		this.server.to(roomName).emit('update', data);
	}


	@SubscribeMessage('refresh')
	handleEventRefresh(
		@ConnectedSocket() client: Socket
	): void {
		if (!this.room.has(client.id))
			return ;
		const roomName = this.room.get(client.id);
		var data = this.room_data.get(roomName);

		updateData(data);
		switch (ballInteraction(data)) {
			case 'offLimitLeft':
				data.player2.score += 1;
				launchBall(data.ball, data.player2, data.t);
				break;
			case 'offLimitRight':
				data.player1.score += 1;
				launchBall(data.ball, data.player1, data.t);
				break;
			case 'touchPlayer1':
				reflectBall(data.ball, data.player1);
				break;
			case 'touchPlayer2':
				reflectBall(data.ball, data.player2);
				break;
		}
		this.room_data.set(roomName, data);
		this.server.to(roomName).emit('update', data);
		if (data.player1.score < 5 && data.player2.score < 5)
			return ;
	}


	@SubscribeMessage('join')
	handleEventJoin(
		@ConnectedSocket() client: Socket
	): void {
		if (this.room.has(client.id))
			return ;
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
			client.emit('accept', 1);
		}
		else {
			const id1 = this.room_properties.get(this.current_room).id1;
			this.room_properties.set(this.current_room, { id1: id1, id2: client.id});
			this.room.set(client.id, this.current_room);
			client.join(this.current_room);
			this.current_room = '';
			client.emit('accept', 2);
		}
		if (this.current_room === "") {
			const roomName = this.room.get(client.id);
			var data = this.room_data.get(roomName);
			launchBall(data.ball, data.player1, data.t);
			this.room_data.set(roomName, data);
			this.server.to(roomName).emit('update', data);
		}
	}
}
