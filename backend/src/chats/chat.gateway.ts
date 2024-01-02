import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { ClientToServerEvents, Message, ServerToClientEvents, UserRoom} from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'
import { ChatsService } from "./chats.service";

@WebSocketGateway({ cors: { origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(private chatService: ChatsService) {}

	@WebSocketServer() server: Server = new Server<ServerToClientEvents, ClientToServerEvents>;
	private logger = new Logger('ChatGateway');

	@SubscribeMessage('chat')
	async handleChat(@MessageBody() payload: Message): Promise<Message> {
		this.logger.log(`Received message: ${payload}`);
		//on sauvegarde le message dans la room
		await this.chatService.addMessageToRoom(payload);
		this.server.to(payload.idRoom).emit('chat', payload);
		return payload;
	}

	@SubscribeMessage('join_room')
	async handleSetClientDataEvent(@MessageBody() payload: { user: UserRoom; idRoom: string;}) {
		if (payload.user.socketId) {
			console.log("join_room", payload.user.socketId, payload.idRoom);
			this.logger.log(`${payload.user.socketId} is joining ${payload.idRoom}`);
			await this.server.in(payload.user.socketId).socketsJoin(payload.idRoom);
			await this.chatService.addUserToRoom(payload.user, payload.idRoom);
			//on envoie les messages de la room
			const messages = await this.chatService.getMessagesByRoom(payload.idRoom);
			if (messages)
			{
				for (const message of messages) {
					this.server.to(payload.idRoom).emit('chat', message);
				}
			}
		}
	}

	async handleConnection(client: Socket) : Promise<void> {
		this.logger.log(`Client connected: ${client.id} : Chats`);
	}

	async handleDisconnect(client: Socket) : Promise<void> {
		await this.chatService.removeUserFromAllRooms(client.id);
		this.logger.log(`Client disconnected: ${client.id} : Chats`);
	}

}
