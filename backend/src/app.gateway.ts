import {
	WebSocketGateway,
	OnGatewayConnection,
	WebSocketServer,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketsService, NotificationType } from './sockets.service';
import { User, UserStatus } from 'users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { PongService } from 'pong/pong.service';
import jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private socketService: SocketsService,
		private dataSource: DataSource,
		private pongService: PongService,
	) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('AppGateway');


	handleConnection(socket: Socket) {
		const request = socket.handshake;
		const token = request.query.token as string;
		const userId = request.query.userId as string;
		if (token && userId) {
			jwt.verify(token, process.env.JWT_SECRET, (err) => {
				if (err)
				{
					socket.emit('notification', {
						type: NotificationType.Error,
						message: 'Access denied',
					});
					this.logger.error('Unauthorized connection');
					socket.disconnect();
				}
				else
				{
					if (this.saveUserSocket(socket, userId))
					{
						this.logger.log("Server: connection established");
						socket.emit('message', 'Server: connection established');
					}
				}
			});

		}
		else
		{
			this.logger.error('Unauthorized connection');
			socket.disconnect();
		}
	}

	//le deconnecter du chat
	async handleDisconnect(socket: Socket) {
		if (this.pongService.isInGame(socket))
			this.pongService.kick(socket);
		this.logger.log("Server: connection stopped");
		const user = this.socketService.removeSocket(socket);
		if (!user)
			return undefined;
		const connectedUser = await this.dataSource.manager.findOneBy(User, {
			id: parseInt(user.userId),
		});
		if (!connectedUser)
			return undefined;
		await this.dataSource.manager.update(User, connectedUser.id, { status: UserStatus.Offline });
		this.logger.log(`User ${connectedUser.username} is now offline`);
	}

	async saveUserSocket(socket: Socket, userId: string) {
		if (userId && userId !== 'undefined') {
			this.socketService.addSocket(userId, socket);
			let connectedUser = await this.dataSource.manager.findOneBy(User, {
				id: parseInt(userId),
			});
			if (!connectedUser)
				return false;
			if (connectedUser.socketId !== '')
				this.server.to(connectedUser.socketId).emit('isSocketConnected', false);
			await this.dataSource.manager.update(User, connectedUser.id, { status: UserStatus.Online, socketId: socket.id });
			this.logger.log(`User ${connectedUser.username} is now online`);
			connectedUser = await this.dataSource.manager.findOneBy(User, {
				id: parseInt(userId),
			});
			socket.emit('infoUser', connectedUser);
			socket.emit('isSocketConnected', true);
			return true;
		}
	}
}
