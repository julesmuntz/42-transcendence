import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Message, UserRoom } from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'
import { ChatsService } from "./chats.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
	constructor(private chatService: ChatsService) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('ChatGateway');

	@SubscribeMessage('chat')
	async handleChat(@MessageBody() payload: Message): Promise<Message> {
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
			const messages = await this.chatService.getMessagesByRoom(payload.roomName);
			if (messages) {
				for (let message of messages)
					await this.server.to(payload.user.socketId).emit('chat', message);
			}
			this.server.to(payload.roomName).emit('connect_chat');
		}
	}

	//renvoie la liste des user de la room
	@SubscribeMessage('user_list')
	async handleUserListEvent(@MessageBody() payload: { roomName: string; }) {
		const users = await this.chatService.getUsersByRoom(payload.roomName);
		if (users) {
			this.server.to(payload.roomName).emit('user_list', users);
		}
	}

	@SubscribeMessage('disconnect_room')
	async handledisconnectRoomEvent(client: Socket) {
		await this.chatService.removeUserFromAllRooms(client.id);
		this.logger.log(`${client.id} is disconnect all rooms`);
	}

}
