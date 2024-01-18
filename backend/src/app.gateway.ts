import {
	WebSocketGateway,
	OnGatewayConnection,
	WebSocketServer,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketsService } from './sockets.service';
import { User, UserStatus } from 'users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Logger, UseGuards } from '@nestjs/common';
import { Room } from 'chats/entities/chat.entity';
import { JwtAuthGuard } from 'auth/guard/jwt.Guards';
import { PongService } from 'pong/pong.service';


@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private socketService: SocketsService,
		private dataSource: DataSource,
		private pongService: PongService,
	) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('AppGateway');

	@UseGuards(JwtAuthGuard)
	handleConnection(socket: Socket) {
		this.logger.log("Server: connection established");
		socket.emit('message', 'Server: connection established');
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
		await this.dataSource.manager.update(User, connectedUser.id, { status: UserStatus.Offline, socketId: '' });

		this.logger.log(`User ${connectedUser.username} is now offline`);
	}

	@SubscribeMessage('saveusersocket')
	async saveUserSocket(socket: Socket, userId: string) {
		if (userId) {
			this.socketService.addSocket(userId, socket);
			let connectedUser = await this.dataSource.manager.findOneBy(User, {
				id: parseInt(userId),
			});
			if (!connectedUser)
				return undefined;
			await this.dataSource.manager.update(User, connectedUser.id, { status: UserStatus.Online, socketId: socket.id });
			this.logger.log(`User ${connectedUser.username} is now online`);
			connectedUser = await this.dataSource.manager.findOneBy(User, {
				id: parseInt(userId),
			});
			this.server.to(socket.id).emit('infoUser', connectedUser);
		}
	}
}
