import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { ClientToServerEventsFriends, ServerToClientEventsFriends} from "../shared/chats.interface";
import { Server, Socket } from 'socket.io'


@WebSocketGateway({ cors: { origin: '*'}})
export class FriendsGateway implements OnGatewayConnection, OnGatewayDisconnect{
	@WebSocketServer() server: Server = new Server<ServerToClientEventsFriends, ClientToServerEventsFriends>;
	private logger = new Logger('FriendsGateway');

	@SubscribeMessage('action_reload')
	async handleActionReload() {
		this.logger.log(`action_reload Friends`);
		this.server.emit('action_reload');
	}

	async handleConnection(client: Socket) : Promise<void> {
		this.logger.log(`Client connected: ${client.id} : Friends`);
	}

	async handleDisconnect(client: Socket) : Promise<void> {
		this.logger.log(`Client disconnected: ${client.id} : Friends`);
	}
}