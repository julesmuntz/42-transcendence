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
import { PongService } from './pong.service';
import { DataMove, DataUpdate } from '../shared/interfaces/data.interface';
import { Server, Socket } from 'socket.io'
import {
	playerSpeed,
} from '../shared/config/pong.config';
import {
	ballInteraction,
	launchBall,
	reflectBall,
	updateData
} from '../shared/functions/game';

@WebSocketGateway({ cors: { origin: '*' } })
export class PongGateway {
	constructor(private pongService: PongService) {}

	@WebSocketServer()
	public server: Server;

	@SubscribeMessage('ping')
	handleEventPing(
		@MessageBody() n: number,
		@ConnectedSocket() client: Socket
	): void {
		client.emit('ping', n);
	}

	@SubscribeMessage('pong_move')
	handleEventMove(
		@MessageBody() direction: number,
		@ConnectedSocket() client: Socket
	): void {
		if (!this.pongService.isInGame(client))
			return ;
		var data = this.pongService.getData(client);
		const player = this.pongService.isFirstPlayer(client) ? data.player1 : data.player2;
		const newSpeed = playerSpeed * Math.sign(direction);

		updateData(data);
		player.vy = newSpeed;
		this.pongService.setData(client, data);
		this.server.to(this.pongService.getRoom(client)).emit('pong_update', data);
	}

	@SubscribeMessage('pong_refresh')
	handleEventRefresh(
		@ConnectedSocket() client: Socket
	): void {
		if (!this.pongService.isInGame(client))
			return ;
		var data = this.pongService.getData(client);
		if (data.player1.score >= 5 || data.player2.score >= 5)
			return ;

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
		this.pongService.setData(client, data);
		if (data.player1.score >= 5 || data.player2.score >= 5)
			this.pongService.registerResults(client);
		this.server.to(this.pongService.getRoom(client)).emit('pong_update', data);
	}

	@SubscribeMessage('pong_join')
	handleEventJoin(
		@MessageBody() id: number,
		@ConnectedSocket() client: Socket
	): void {
		if (this.pongService.isInGame(client))
			return ;
		const playerId = this.pongService.joinGame(client, id);
		client.emit('pong_accept', playerId);
		if (this.pongService.gameStart()) {
			var data = this.pongService.getData(client);
			launchBall(data.ball, data.player1, data.t);
			this.pongService.setData(client, data);
			this.server.to(this.pongService.getRoom(client)).emit('pong_update', data);
		}
	}
}
