import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'


@WebSocketGateway({ cors: { origin: '*' } })
export class FriendsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private logger = new Logger('FriendsGateway');

	@SubscribeMessage('refresh')
	async handleActionReload() {
		this.logger.log(`refresh Friends`);
		this.server.emit('refresh');
	}

	async handleConnection(client: Socket): Promise<void> {
		this.logger.log(`Client connected: ${client.id} : Friends`);
	}

	async handleDisconnect(client: Socket): Promise<void> {
		this.logger.log(`Client disconnected: ${client.id} : Friends`);
	}
}