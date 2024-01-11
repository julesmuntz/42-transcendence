import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Message, UserRoom } from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'
import { ChatsService } from "./chats.service";
import { Channel } from 'diagnostics_channel';
import { ChannelMemberService } from 'channels/Service/channel-member.service';
import { ChannelMemberPermission, ChannelMemberRole } from 'channels/entities/channel-member.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
	constructor(private chatService: ChatsService,
		private readonly channelUser : ChannelMemberService) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('ChatGateway');

	//si channel check si le user est pas mute
	@SubscribeMessage('chat')
	async handleChat(@MessageBody() payload: Message): Promise<Message> {
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
		return payload;
	}

	//renvoie la liste des user de la room
	@SubscribeMessage('join_room')
	async handleSetClientDataEvent(@MessageBody() payload: { user: UserRoom; roomName: string; }) {
		if (payload.user.socketId) {
			this.logger.log(`${payload.user.socketId} is joining ${payload.roomName}`);
			await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
			await this.chatService.addUserToRoom(payload.user, payload.roomName);
			const room = await this.chatService.getRoomByName(payload.roomName);
			if (room) {
				const channel_user = await this.channelUser.findOneByChannel(payload.roomName);
				if(channel_user){
					if (channel_user.permission === ChannelMemberPermission.Muted)
						payload.user.muted = true;
					else
						payload.user.muted = false;
					if (channel_user.role === ChannelMemberRole.Owner)
						payload.user.type = "Owner";
					else if (channel_user.role === ChannelMemberRole.Admin)
						payload.user.type = "Admin";
					else
						payload.user.type = "regular";
				}
			}
			const messages = await this.chatService.getMessagesByRoom(payload.roomName);
			if (messages) {
				for (let message of messages)
					await this.server.to(payload.user.socketId).emit('chat', message);
			}
			await this.server.to(payload.roomName).emit('chat_user', payload.user);
			this.handleUserListEvent(payload.roomName);
		}
	}

	//renvoie la liste des user de la room
	async handleUserListEvent(roomName: string) {
		this.logger.log(`get user list of ${roomName}`);
		const users = await this.chatService.getUsersByRoom(roomName);
		if (users) {
			this.server.to(roomName).emit('user_list', users);
		}
	}

	@SubscribeMessage('disconnect_room')
	async handledisconnectRoomEvent(client: Socket) {
		await this.chatService.removeUserFromAllRooms(client.id);
		this.logger.log(`${client.id} is disconnect all rooms`);
	}

}
