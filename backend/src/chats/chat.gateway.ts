import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Message, UserRoom } from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'
import { ChatsService } from "./chats.service";
import { ChannelMemberService } from 'channels/Service/channel-member.service';
import { ChannelMemberAccess, ChannelMemberPermission, ChannelMemberRole } from 'channels/entities/channel-member.entity';
import { ChannelsService } from 'channels/Service/channels.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
	constructor(private chatService: ChatsService,
		private readonly channelUser: ChannelMemberService,
		private readonly channel: ChannelsService) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('ChatGateway');

	//si channel check si le user est pas mute
	@SubscribeMessage('chat')
	async handleChat(@MessageBody() payload: Message): Promise<Message> {
		const room = await this.chatService.getRoomByName(payload.roomName);
		if (room.channel) {
			console.log(payload.user);
			if (payload.user.muted) {
				this.logger.log(`User ${payload.user.userId} is muted`);
				return;
			}
		}
		this.logger.log(`Received message: ${payload}`);
		await this.chatService.addMessageToRoom(payload);
		this.server.to(payload.roomName).emit('chat', payload);
		return payload;
	}


	async createUserRoom(user: UserRoom, roomName: string): Promise<UserRoom | undefined> {
		const room = await this.channel.findOneByName(roomName);
		if (room) {
			const channel_user = await this.channelUser.findOneByChannelNameAndUser(roomName, user.userId);
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
			}
		}
		return user;
	}
	//renvoie la liste des user de la room
	@SubscribeMessage('join_room')
	async handleSetClientDataEvent(@MessageBody() payload: { user: UserRoom; roomName: string; }) {
		if (payload.user.socketId) {
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
		this.logger.log(`Get user list of ${roomName}`);
		try {
			const users = await this.channelUser.findAllByChannelName(roomName);
			// console.log(users);
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
					});
				}
				//   console.log(roomUsers);
				// Assuming 'user_list' is the event name; adjust it based on your client-side implementation
				this.server.to(roomName).emit('user_list', roomUsers);
			}
		} catch (error) {
			this.logger.error(`Error getting user list for ${roomName}: ${error.message}`);
		}
	}


	@SubscribeMessage('disconnect_room')
	async handledisconnectRoomEvent(client: Socket) {
		await this.chatService.removeUserFromAllRooms(client.id);
		this.logger.log(`${client.id} is disconnect all rooms`);
	}

}
