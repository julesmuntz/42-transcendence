import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Message, UserRoom } from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'
import { ChatsService } from "./chats.service";
import { ChannelMember, ChannelMemberAccess, ChannelMemberPermission, ChannelMemberRole } from 'channels/entities/channel-member.entity';
import { DataSource } from 'typeorm';
import { Channel } from 'channels/entities/channel.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
	constructor(private chatService: ChatsService,
		private dataSource:DataSource
		) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('ChatGateway');

	@SubscribeMessage('chat')
	async handleChat(@MessageBody() payload: Message) {
		const room = await this.chatService.getRoomByName(payload.roomName);
		if (room.channel) {
			if (payload.user.muted) {
				this.logger.log(`User ${payload.user.userId} is muted`);
				return;
			}
		}
		this.logger.log(`Received message: ${payload}`);
		await this.chatService.addMessageToRoom(payload);
		this.server.to(payload.roomName).emit('chat', payload);
	}


	async createUserRoom(user: UserRoom, roomName: string): Promise<UserRoom | undefined> {
		const room = await this.dataSource.manager.findOne(Channel, { where: { name: roomName }})
		if (room) {
			const channel_user = await this.dataSource.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: { channel: {id: room.id}, user: {id: user.userId} }})
			if (channel_user) {
				if (channel_user.permission === ChannelMemberPermission.Muted)
					user.muted = true;
				else
					user.muted = false;
				if (channel_user.access === ChannelMemberAccess.Banned) {
					this.server.to(user.socketId).emit('banned', 'You are banned from this channel');
					return undefined;
				}
				if (channel_user.role === ChannelMemberRole.Owner)
					user.type = "Owner";
				else if (channel_user.role === ChannelMemberRole.Admin)
					user.type = "Admin";
				else
					user.type = "regular";
				user.avatarPath = channel_user.user.avatarPath;
				if (room.type === 'protected' && channel_user.pass === false)
				{
					this.server.to(user.socketId).emit('banned', 'You are banned from this channel');
					return undefined;
				}
			}
			else
			{
				this.server.to(user.socketId).emit('banned', 'You are banned from this channel');
				return undefined;
			}
		}
		return user;
	}
	//renvoie la liste des user de la room
	@SubscribeMessage('join_room')
	async handleSetClientDataEvent(@MessageBody() payload: { user: UserRoom; roomName: string; }) {
		if (payload.user.socketId && payload.roomName) {
			const user = await this.createUserRoom(payload.user, payload.roomName);
			if (!user)
				return;
			this.logger.log(`${payload.user.socketId} is joining ${payload.roomName}`);
			await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
			await this.chatService.addUserToRoom(payload.user, payload.roomName);
			const messages = await this.chatService.getMessagesByRoom(payload.roomName);
			if (messages) {
				for (let message of messages)
					await this.server.to(payload.user.socketId).emit('chat', message);
			}
			await this.server.to(payload.user.socketId).emit('chat_user', user);
			this.server.to(payload.user.socketId).emit('connect_chat');
			this.handleUserListEvent(payload.roomName);
		}
	}

	@SubscribeMessage('update_chat_user')
	async handleUpdateChatUserEvent(@MessageBody() payload: { user: UserRoom; roomName: string; }) {
		if (payload.user.socketId) {
			const user = await this.createUserRoom(payload.user, payload.roomName);
			if (!user)
				return;
			this.logger.log(`${payload.user.socketId} is updating ${payload.roomName}`);
			await this.server.to(payload.user.socketId).emit('chat_user', user);
			this.handleUserListEvent(payload.roomName);
		}
	}
	//renvoie la liste des user de la room
	// Corrected handleUserListEvent function
	async handleUserListEvent(roomName: string) {

		if (!roomName)
			return;
		this.logger.log(`Get user list of ${roomName}`);
		const users =  await this.dataSource.manager.find(ChannelMember, {relations: ['channel', 'user'], where: { channel: {name: roomName} }})
		if (users && users.length > 0) {
			const roomUsers: UserRoom[] = [];
			for (const user of users) {
				roomUsers.push({
					userId: user.user.id,
					userName: user.user.username,
					socketId: user.user.socketId,
					muted: user.permission === ChannelMemberPermission.Muted ?? false,
					type: user.role === ChannelMemberRole.Owner ? 'Owner' : user.role === ChannelMemberRole.Admin ? 'Admin' : 'regular',
					ban: user.access === ChannelMemberAccess.Banned ?? false,
					avatarPath: user.user.avatarPath,
				});
			}
			this.server.to(roomName).emit('user_list', roomUsers);
		}
	}
}
