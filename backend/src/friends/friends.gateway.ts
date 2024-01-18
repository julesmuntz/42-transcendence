import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { DataSource } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Room } from 'chats/entities/chat.entity';
import { Friend, RelationType } from './entities/friend.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class FriendsGateway {
	constructor(
		private dataSource: DataSource,
	) {}

	@WebSocketServer() server: Server;
	private logger = new Logger('FriendsGateway');

	@SubscribeMessage('refresh_friends')
	async handleRefreshFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} })
		let friends;
		if (user) {
			friends = await this.dataSource.manager.findOne(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id: payload.id }, user2: { id: user.id }, type: RelationType.Blocked },	{ user1: { id: user.id }, user2: { id: payload.id }, type: RelationType.Blocked },],});
			if (!friends)
				friends = await this.dataSource.manager.findOne(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id:  payload.id }, user2: { id: user.id }, type: RelationType.Invited },	{ user1: { id: user.id }, user2: { id:  payload.id }, type: RelationType.Invited },],});
			if (!friends)
				friends = await this.dataSource.manager.findOne(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id:  payload.id }, user2: { id: user.id }, type: RelationType.Friend },	{ user1: { id: user.id }, user2: { id:  payload.id }, type: RelationType.Friend },],});
			if (friends) {
				this.logger.log`User ${user.username} refreshing friends ${payload.id}`;
				this.server.to(client.id).emit('friends', friends);
			}
		}
	}

	@SubscribeMessage('refresh_friends_all')
	async handleRefreshFriendsAll(client: Socket): Promise<void> {
		this.handleRefreshFriendsAllsocketId(client.id, RelationType.Friend);
	}

	@SubscribeMessage('invite_friends')
	async handleInviteFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} })
		const idUserTarget = await this.dataSource.manager.findOne(User, { where: {id: payload.id} })
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends = await this.dataSource.manager.save(Friend, { user1: user, user2: idUserTarget, type: RelationType.Invited });
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
		const rooms = await this.dataSource.manager.findOne(Room, { where: {name: string} })
			if (rooms)
				return this.randomString();
		return string;
	}

	@SubscribeMessage('accept_friends')
	async handleAcceptFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} })
		const idUserTarget = await this.dataSource.manager.findOne(User, { where: {id: payload.id} })
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends_view = await this.dataSource.manager.findOne(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id:  payload.id }, user2: { id: user.id }, type: RelationType.Invited },	{ user1: { id: user.id }, user2: { id:  payload.id }, type: RelationType.Invited },],});
			if (friends_view) {
				const string = await this.randomString();
				const roomName = await this.dataSource.manager.save(Room, { name: string, host: { userId: friends_view.user1.id, userName: friends_view.user1.username, socketId: "" }, users: [], message: [], channel: false })
				const friends = await this.dataSource.manager.save(Friend, { id: friends_view.id, type: RelationType.Friend, roomName: roomName.name });
				if (friends) {
					this.logger.log`User ${user.username} accepting ${idUserTarget.username}`;
					this.server.to(client.id).emit('friends', friends);
					this.handleRefreshFriendsAllsocketId(client.id, RelationType.Friend);
					if (idUserTarget.socketId)
					{
						this.server.to(idUserTarget.socketId).emit('friends', friends);
						this.handleRefreshFriendsAllsocketId(idUserTarget.socketId, RelationType.Friend);
					}
				}
			}
		}
	}

	@SubscribeMessage('block_friends')
	async handleBlockFriends(client: Socket, payload: { id: number }): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} })
		const idUserTarget = await this.dataSource.manager.findOne(User, { where: {id: payload.id} })
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends_view = await this.dataSource.manager.findOne(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id:  payload.id }, user2: { id: user.id } },	{ user1: { id: user.id }, user2: { id:  payload.id } },],});
			if (friends_view)
			{
				this.dataSource.manager.delete(Friend, { id: friends_view.id });
				this.dataSource.manager.delete(Room, { name: friends_view.roomName });
			}
			const friends = await this.dataSource.manager.save(Friend, { user1: user, user2: idUserTarget, type: RelationType.Blocked });
			if (friends) {
				this.server.to(client.id).emit('friends', friends);
				this.handleRefreshFriendsAllsocketId(client.id, RelationType.Friend);
				this.handleRefreshFriendsAllsocketId(client.id, RelationType.Blocked);
				if (idUserTarget.socketId)
				{
					this.server.to(idUserTarget.socketId).emit('friends', friends);
					this.handleRefreshFriendsAllsocketId(idUserTarget.socketId, RelationType.Friend);
					this.handleRefreshFriendsAllsocketId(idUserTarget.socketId, RelationType.Blocked);
				}
			}
		}
	}

	@SubscribeMessage('delete_friends')
	async handleDeleteFriends(client: Socket, payload: { id: number }): Promise<void> {
		console.log('delete_friends')
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} })
		const idUserTarget = await this.dataSource.manager.findOne(User, { where: {id: payload.id} })
		if (user && idUserTarget && user.id != idUserTarget.id) {
			const friends_view = await this.dataSource.manager.findOne(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id:  payload.id }, user2: { id: user.id } },	{ user1: { id: user.id }, user2: { id:  payload.id } },],});
			if (friends_view) {
				this.logger.log(`User ${user.username} deleting ${idUserTarget.username}`);
				if (friends_view.roomName)
					this.dataSource.manager.delete(Room, { name: friends_view.roomName });
				this.dataSource.manager.delete(Friend, { id: friends_view.id });
			}
			this.server.to(client.id).emit('friends', null);
			this.handleRefreshFriendsAllsocketId(client.id, RelationType.Friend);
			if (idUserTarget.socketId)
			{
				this.server.to(idUserTarget.socketId).emit('friends', null);
				this.server.to(idUserTarget.socketId).emit('friendsInviteRemoved');
				this.handleRefreshFriendsAllsocketId(idUserTarget.socketId, RelationType.Friend);
			}
		}
	}

	@SubscribeMessage('notification_friendsInvited')
	async handleNotificationFriendsInvited(client: Socket, payload: {id: number}): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} });
		let idUserTarget = null;
		if (payload.id)
			idUserTarget = await this.dataSource.manager.findOne(User, { where: {id: payload.id} });
		if (user) {
			const friends = await this.dataSource.manager.find(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id: user.id }, type: RelationType.Invited },	{ user2: { id: user.id }, type: RelationType.Invited },],});
			if (friends.length > 0) {
				this.logger.log(`User ${user.username} refreshing friends invited`);
				this.server.to(client.id).emit('friendsInvited', friends);
				if (idUserTarget && idUserTarget.socketId)
				{
					this.logger.log(`User ${idUserTarget.username} refreshing friends invited`);
					this.server.to(idUserTarget.socketId).emit('friendsInvited', friends);
				}
			}
			else {
				this.logger.log(`User ${user.username} refreshing friends invited`);
				this.server.to(client.id).emit('friendsInvited', null);
				if (idUserTarget && idUserTarget.socketId)
				{
					this.logger.log(`User ${idUserTarget.username} refreshing friends invited`);
					this.server.to(idUserTarget.socketId).emit('friendsInvited', null);
				}
			}
		}
	}

	@SubscribeMessage('friendsBlocked')
	async handleFriendsBlocked(client: Socket): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client.id} });
		if (user) {
			const friends = await this.dataSource.manager.find(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id: user.id }, type: RelationType.Blocked },	{ user2: { id: user.id }, type: RelationType.Blocked },],});
			if (friends.length > 0) {
				this.logger.log(`User ${user.username} refreshing friends blocked`);
				this.server.to(client.id).emit('friendsBlocked', friends);
			}
			else {
				this.logger.log(`User ${user.username} refreshing friends blocked`);
				this.server.to(client.id).emit('friendsBlocked', null);
			}
		}
	}

	async handleRefreshFriendsAllsocketId(client: string, type : RelationType): Promise<void> {
		const user = await this.dataSource.manager.findOne(User, { where: {socketId: client} })
		if (user) {
			const friends = await this.dataSource.manager.find(Friend, { relations: ["user1", "user2"],where: [	{ user1: { id: user.id }, type: type },	{ user2: { id: user.id }, type: type },],});
			if (friends) {
				this.logger.log(`User ${user.username} refreshing friends all`);
				if (friends.length > 0)
					if (type !== RelationType.Blocked)
						this.server.to(client).emit('Viewfriends', friends);
					else
						this.server.to(client).emit('friendsBlocked', friends);
				else
				{
					this.server.to(client).emit('Viewfriends', null);
					this.server.to(client).emit('friendsBlocked', null);
				}

			}
		}
	}

}