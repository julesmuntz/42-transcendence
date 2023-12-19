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
		this.logger.log(`Received message: ${payload}}`);
		this.server.to(payload.idRoom.toString()).emit('chat', payload);
		return payload;
	}

	@SubscribeMessage('join_room')
	async handleSetClientDataEvent(@MessageBody() payload: { user: UserRoom; idRoom: number; roomName: string }) {
		if (payload.user.socketId) {
			this.logger.log(`${payload.user.socketId} is joining ${payload.idRoom}`);
			await this.server.in(payload.user.socketId).socketsJoin(payload.idRoom.toString());
			await this.chatService.addUserToRoom(payload.user, payload.idRoom);
		}
	}

	async handleConnection(client: Socket) : Promise<void> {
		this.logger.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: Socket) : Promise<void> {
		// await this.chatService.removeUserFromAllRooms(client.id);
		this.logger.log(`Client disconnected: ${client.id}`);
	}

}
