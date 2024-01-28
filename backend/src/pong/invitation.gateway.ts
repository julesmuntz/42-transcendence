import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { NotificationType } from 'sockets.service';
import { DataSource, Not } from 'typeorm';
import { PongService } from './pong.service';
import { User, UserStatus } from 'users/entities/user.entity';
import { userInfo } from "shared/chats.interface";

@WebSocketGateway({ cors: { origin: '*' } })
export class InvitationGateway {
	constructor(
		private dataSources : DataSource,
		private pongService: PongService
	) {}
	private saveInvitations: Map<number, userInfo> = new Map<number, userInfo>;

	@WebSocketServer()
	public server: Server;

	@SubscribeMessage('InvitePlayer')
	async handleEventInvitePlayer(
		@MessageBody() payload:  {userId: number},
		@ConnectedSocket() client: Socket
	) {
		const IdTargetConnect = await this.dataSources.manager.findOne(User, {where: {id: payload.userId}});
		const user = await this.dataSources.manager.findOne(User, {where: {socketId: client.id}});
		let t = true;
		if (IdTargetConnect && user && IdTargetConnect.status === UserStatus.Online && user.id !== IdTargetConnect.id)
		{
			this.saveInvitations.forEach((value) => {
				if (value.id === user.id)
				{
					client.emit('notification', {
						type: NotificationType.Error,
						message: 'You are already invited'}
					);
					t = false;
					return ;
				}
			});
			if (!this.saveInvitations.has(IdTargetConnect.id) && !this.saveInvitations.has(user.id) && t) {
				this.saveInvitations.set(IdTargetConnect.id, user as userInfo); // mettre un temps pour supprimer l'invitation automatiquement
				const expirationTime = 15 * 1000; // 15 secondes en millisecondes
				setTimeout(() => {
					if (this.saveInvitations.has(IdTargetConnect.id))
					{
						this.saveInvitations.delete(IdTargetConnect.id);
						client.emit('notification', {
							type: NotificationType.Warning,
							message: 'Invite expired'}
						);
					}
				}, expirationTime);

				client.emit('notification', {
				type: NotificationType.Success,
				message: 'Invite sent'}
				);
				this.server.to(IdTargetConnect.socketId).emit('invited', user.username);
				return ;
			}
			else if (!t)
				return ;
			client.emit('notification', {
				type: NotificationType.Warning,
				message: 'User already invited'}
			);
		}
		else
			client.emit('notification', {
				type: NotificationType.Error,
				message: 'User cannot be invited'}
			);
	}

	//delete invitation in to map saveInvitations
	@SubscribeMessage('AcceptInvitation')
	async handleEventAcceptInvitation(
		@ConnectedSocket() client: Socket
	) {
		const IdTargetConnect = await this.dataSources.manager.findOne(User, {where: {socketId: client.id}});
		if (IdTargetConnect)
		{
			const user = this.saveInvitations.get(IdTargetConnect.id);
			if (user)
			{
				this.saveInvitations.delete(IdTargetConnect.id);
				this.pongService.setPrivateGame(user.id, IdTargetConnect.id);
				client.emit('AcceptInvitation');
				this.server.to(user.socketId).emit('AcceptInvitation');
			}
			else
				client.emit('notification', {
					type: NotificationType.Error,
					message: 'Invite not found'}
				);
		}
	}

	@SubscribeMessage('RefuseInvitation')
	async handleEventRefuseInvitation(
		@ConnectedSocket() client: Socket
	) {
		const IdTargetConnect = await this.dataSources.manager.findOne(User, {where: {socketId: client.id}});
		if (IdTargetConnect)
		{
			const user = this.saveInvitations.get(IdTargetConnect.id);
			if (user)
			{
				this.saveInvitations.delete(IdTargetConnect.id);
				this.server.to(user.socketId).emit('notification', {
					type: NotificationType.Warning,
					message: 'Invite refused'}
				);
			}
			else
			client.emit('notification', {
				type: NotificationType.Error,
				message: 'Invite not found'}
			);
		}
	}

}
