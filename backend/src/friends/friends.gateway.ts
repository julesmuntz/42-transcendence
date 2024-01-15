import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { UsersService } from 'users/users.service';
import { FriendsService } from './friends.service';
import { RelationType } from './entities/friend.entity';
import { ChatsService } from 'chats/chats.service';
import { CreateFriendDto } from './dto/create-friend.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class FriendsGateway {
	constructor(
		private readonly userService: UsersService,
		private readonly friendsService: FriendsService,
		private readonly chatsService: ChatsService
	) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('FriendsGateway');

	@SubscribeMessage('refresh_friends')
	async handleRefreshFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.userService.findOneBySocketId(client.id);
		let friends;
		if (user) {
			friends = await this.friendsService.viewblock(user.id, payload.id);
			if (!friends)
				friends = await this.friendsService.viewinvite(user.id, payload.id);
			if (!friends)
				friends = await this.friendsService.viewfriends(user.id, payload.id);
			if (friends) {
				this.logger.log`User ${user.username} refreshing friends ${payload.id}`;
				this.server.to(client.id).emit('friends', friends);
			}
		}
	}

	@SubscribeMessage('invite_friends')
	async handleInviteFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.userService.findOneBySocketId(client.id);
		const idUserTarget = await this.userService.findOne(payload.id);
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends = await this.friendsService.create({ user1: user, user2: idUserTarget, type: RelationType.Invited } as CreateFriendDto);
			if (friends) {
				this.logger.log`User ${user.username} inviting ${idUserTarget.username}`;
				this.server.to(client.id).emit('friends', friends);
				if (idUserTarget.socketId)
					this.server.to(idUserTarget.socketId).emit('friends', friends);
			}

		}
	}

	async randomString(): Promise<string> {
		let string = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 10; i++)
			string += possible.charAt(Math.floor(Math.random() * possible.length));
		const rooms = await this.chatsService.getRoomByName(string);
			if (rooms)
				return this.randomString();
		return string;
	}

	@SubscribeMessage('accept_friends')
	async handleAcceptFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.userService.findOneBySocketId(client.id);
		const idUserTarget = await this.userService.findOne(payload.id);
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends_view = await this.friendsService.viewinvite(user.id, idUserTarget.id);
			if (friends_view) {
				const string = await this.randomString();
				const roomName = await this.chatsService.addRoom(string, { userId: friends_view.user1.id, userName: friends_view.user1.username, socketId: "" }, false);
				const friends = await this.friendsService.update(friends_view.id, { type: RelationType.Friend, roomName: roomName });
				if (friends) {
					this.logger.log`User ${user.username} accepting ${idUserTarget.username}`;
					this.server.to(client.id).emit('friends', friends);
					if (idUserTarget.socketId)
						this.server.to(idUserTarget.socketId).emit('friends', friends);
				}
			}
		}
	}

	@SubscribeMessage('block_friends')
	async handleBlockFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.userService.findOneBySocketId(client.id);
		const idUserTarget = await this.userService.findOne(payload.id);
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends_view = await this.friendsService.view(user.id, idUserTarget.id);
			if (friends_view)
				this.friendsService.delete(friends_view.id);
			const friends = await this.friendsService.create({ user1: user, user2: idUserTarget, type: RelationType.Blocked } as CreateFriendDto);
			if (friends) {
				this.server.to(client.id).emit('friends', friends);
				if (idUserTarget.socketId)
					this.server.to(idUserTarget.socketId).emit('friends', friends);
			}
		}
	}

	@SubscribeMessage('delete_friends')
	async handleDeleteFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.userService.findOneBySocketId(client.id);
		const idUserTarget = await this.userService.findOne(payload.id);
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends_view = await this.friendsService.view(user.id, idUserTarget.id);
			if (friends_view) {
				this.logger.log`User ${user.username} deleting ${idUserTarget.username}`;
				this.chatsService.removeRoom(friends_view.roomName);
				this.friendsService.delete(friends_view.id);
			}
			this.server.to(client.id).emit('friends', null);
			if (idUserTarget.socketId)
				this.server.to(idUserTarget.socketId).emit('friends', null);
		}
	}
}