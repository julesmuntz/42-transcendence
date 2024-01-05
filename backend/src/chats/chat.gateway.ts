import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import {  Message, UserRoom} from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'
import { ChatsService } from "./chats.service";

@WebSocketGateway({ cors: { origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(private chatService: ChatsService) {}

	@WebSocketServer() server: Server;
	private logger = new Logger('ChatGateway');

	@SubscribeMessage('chat')
	async handleChat(@MessageBody() payload: Message): Promise<Message> {
		this.logger.log(`Received message: ${payload}`);
		//on sauvegarde le message dans la room
		await this.chatService.addMessageToRoom(payload);
		this.server.to(payload.roomName).emit('chat', payload);
		return payload;
	}

	@SubscribeMessage('join_room')
	async handleSetClientDataEvent(@MessageBody() payload: { user: UserRoom; roomName: string;}) {
		if (payload.user.socketId) {
			console.log("join_room", payload.user.socketId, payload.roomName);
			this.logger.log(`${payload.user.socketId} is joining ${payload.roomName}`);
			await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
			await this.chatService.addUserToRoom(payload.user, payload.roomName);
			//on envoie les messages de la room
			const messages = await this.chatService.getMessagesByRoom(payload.roomName);
			if (messages)
			{
				for (const message of messages) {
					this.server.to(payload.roomName).emit('chat', message);
				}
			}
		}
	}

	@SubscribeMessage('get_messages')
	async handleGetMessagesEvent(@MessageBody() payload: { roomName: string;}) {
		if (payload.roomName) {
			console.log("get_messages", payload.roomName);
			this.logger.log(`${payload.roomName} is getting messages`);
			//on envoie les messages de la room
			const messages = await this.chatService.getMessagesByRoom(payload.roomName);
			if (messages)
			{
				for (const message of messages) {
					this.server.to(payload.roomName).emit('chat', message);
				}
			}
		}
	}

	// chanel room event handler
	// a modifier car pas bon du tout
	// @SubscribeMessage('kick_room')
	// async handleKickRoomEvent(@MessageBody() payload: { user: UserRoom; roomName: string;}) {
	// 	if (payload.user.socketId) {
	// 		console.log("kick_room", payload.user.socketId, payload.roomName);
	// 		this.logger.log(`${payload.user.socketId} is leaving ${payload.roomName}`);
	// 		await this.server.in(payload.user.socketId).socketsLeave(payload.roomName);
	// 		await this.chatService.removeUserFromRoom(payload.user, payload.roomName);
	// 	}
	// }

	// @SubscribeMessage('ban_room')
	// async handleBanRoomEvent(@MessageBody() payload: { user: UserRoom; roomName: string;}) {
	// 	if (payload.user.socketId) {
	// 		console.log("ban_room", payload.user.socketId, payload.roomName);
	// 		this.logger.log(`${payload.user.socketId} is leaving ${payload.roomName}`);
	// 		await this.server.in(payload.user.socketId).socketsLeave(payload.roomName);
	// 		await this.chatService.removeUserFromRoom(payload.user, payload.roomName);
	// 	}
	// }

	// @SubscribeMessage('mute_room')
	// async handleMuteRoomEvent(@MessageBody() payload: { user: UserRoom; roomName: string;}) {
	// 	if (payload.user.socketId) {
	// 		console.log("mute_room", payload.user.socketId, payload.roomName);
	// 		this.logger.log(`${payload.user.socketId} is leaving ${payload.roomName}`);
	// 		await this.server.in(payload.user.socketId).socketsLeave(payload.roomName);
	// 		await this.chatService.removeUserFromRoom(payload.user, payload.roomName);
	// 	}
	// }
	//end chanel room event handler

	async handleConnection(client: Socket) : Promise<void> {
		this.logger.log(`Client connected: ${client.id} : Chats`);
	}

	async handleDisconnect(client: Socket) : Promise<void> {
		await this.chatService.removeUserFromAllRooms(client.id);
		this.logger.log(`Client disconnected: ${client.id} : Chats`);
	}

}
