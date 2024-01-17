import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { ChatsService } from 'chats/chats.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io'
import { Channel, ChannelType } from './entities/channel.entity';
import { UserRoom } from "../shared/chats.interface";
import { ChannelMember, ChannelMemberAccess, ChannelMemberPermission, ChannelMemberRole } from './entities/channel-member.entity';
import { DataSource } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Room } from 'chats/entities/chat.entity';
import * as bcrypt from 'bcrypt';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway {
	constructor(
		private chatService: ChatsService,
		private dataSources: DataSource
	) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('ChannelsGateway');

	// create channel
	@SubscribeMessage('createChannel')
	async handleCreatingEvent(@MessageBody() payload: { createChannelDto: { name: string; type: ChannelType; passwordHash: string | undefined;}; userId: string }) {
		const channelExist = await this.dataSources.manager.findOne(Channel, { where: { name: payload.createChannelDto.name } });
		if (!channelExist) {
			if (payload.createChannelDto.passwordHash)
			payload.createChannelDto.passwordHash = await bcrypt.hash(payload.createChannelDto.passwordHash, 10);
			const channel = await this.dataSources.manager.save(Channel, payload.createChannelDto);
			console.log(channel);
			if (channel) {
				const user = await this.dataSources.manager.findOne(User, { where: { id: parseInt(payload.userId) } });
				if (user) {
					const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel, role: ChannelMemberRole.Owner})
					if (channelMember) {
						const room = await this.dataSources.manager.save(Room, { 'name': channel.name, host: { userId: parseInt(payload.userId), userName: user.username, socketId: '' }, users: [], message: [],channel:true });
						if (room) {
							this.logger.log(`Channel ${channel.name} created`);
							if (channel.type === ChannelType.Private)
								this.server.to(user.socketId).emit('updateChannelList', channel);
							else
							this.server.emit('updateChannelList', channel);

							return channel;
						}
					}
				}
			}
		}
	}

	// suprimer channel
	@SubscribeMessage('deleteChannel')
	async handleDeletingEvent(@MessageBody() payload: { roomName: string }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		if (channel) {
			this.dataSources.manager.delete(ChannelMember, { channel: channel});
			this.dataSources.manager.delete(Channel, { id: channel.id });
			this.dataSources.manager.delete(Room, { name: channel.name });
			this.logger.log(`Channel ${channel.name} deleted`);
			this.server.emit('deleteChannel', channel);
			return channel;
		}
	}

	@SubscribeMessage('getChannel')
	async handleGetChannel(socket: Socket) {
		const user = await this.dataSources.manager.findOne(User, { where: { socketId: socket.id } });
		const channel = await this.dataSources.manager.find(Channel);
		let validChannels = [];
		if (channel && user) {
			for (const element of channel) {
				const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: { channel: {id: element.id}, user: {id: user.id}, access: ChannelMemberAccess.Regular } });
				if (channelMember)
					validChannels.push(element);
				else if (element.type !== ChannelType.Private)
					validChannels.push(element);
			}
			this.logger.log(`emit server getChannel ${socket.id}`);
			this.server.to(socket.id).emit('channelList', validChannels);
			return channel;
		}
	}

	//verifier si le user est dans la room
	@SubscribeMessage('inviteChannels')
	async handleInviteChannels(@MessageBody() payload: { userId: number; channelId: number; }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { id: payload.channelId } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const userExist = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: { channel: {id: channel.id}, user: {id : user.id} } });
			if (!userExist) {
				const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel});
				if (channelMember) {
					this.logger.log(`User "${user.username}" invited to Channel "${channel.name}"`);
					this.server.to(user.socketId).emit('updateChannelListPrivate', channel);
					return channel;
				}
			}
		}
	}

	@SubscribeMessage('joinChannel')
	async handleJoinChannel(@MessageBody() payload: { userId: number; channelId: string; }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.channelId } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const userExist = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: { channel: {id: channel.id}, user: {id : user.id} } });
			if (!userExist) {
				const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel });
				if (channelMember) {
					this.logger.log(`User "${user.username}" join to Channel "${channel.name}"`);
					this.server.to(user.socketId).emit('passwordChannel', payload.channelId);
					return channel;
				}
			}
			else
				this.server.to(user.socketId).emit('passwordChannel', payload.channelId);
		}
	}

	@SubscribeMessage('passwordChannel')
	async handlePasswordChannel(@MessageBody() payload: { channelId: string, password: string, userId: number }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.channelId } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const compare = await bcrypt.compare(payload.password, channel.passwordHash);
			console.log(compare);
			if (compare) {
				const userExist = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: { channel: {id: channel.id}, user: {id : user.id}} });
				console.log(userExist);
				if (!userExist) {
					const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel, pass: true });
					if (channelMember) {
						this.logger.log(`User "${user.username}" join to Channel "${channel.name}"`);
						await this.server.to(user.socketId).emit('passwordChannel', payload.channelId);
						return channel;
					}
				}
				else
				{
					await this.dataSources.manager.save(ChannelMember, { id: userExist.id, pass: true });
					this.server.to(user.socketId).emit('passwordChannel', payload.channelId);
				}

			}
		}
	}

	@SubscribeMessage('kickChannel')
	async handleKickChannel(@MessageBody() payload: { userId: number; roomName: string; }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id}, user: {id: user.id} }});
			if (channelMember) {
				this.dataSources.manager.delete(ChannelMember, { id: channelMember.id });
				this.logger.log(`Channel ${channel.name} kicked to ${user.username}`);
				if (user.socketId !== '') {
					await this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
					if (user.socketId !== '') {
						await this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
						await this.server.to(user.socketId).emit('banned', 'You are kick from this channel');
					}
				}
				return channel;
			}
		}
	}

	@SubscribeMessage('banChannel')
	async handleBanChannel(@MessageBody() payload: { userId: number; roomName: string; }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id }, user: {id: user.id} }});
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, access: ChannelMemberAccess.Banned });
				this.logger.log(`Channel ${channel.name} banned to ${user.username}`);
				if (user.socketId !== '') {
					await this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
					if (user.socketId !== '') {
						await this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
						await this.server.to(user.socketId).emit('banned', 'You are kick from this channel');
					}
				}
				return channel;
			}
		}
	}

	@SubscribeMessage('unbanChannel')
	async handleUnbanChannel(@MessageBody() payload: { userId: number; roomName: string; }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id} , user: {id: user.id}} });
			if (channelMember) {
				await this.dataSources.manager.delete(ChannelMember, { id: channelMember.id });
				this.logger.log(`Channel ${channel.name} unbanned to ${user.username}`);
				await this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
				return channel;
			}
		}
	}

	//a finir pour les permissions
	@SubscribeMessage('muteChannel')
	async handleMuteChannel(@MessageBody() payload: { userId: number; roomName: string; }) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id}, user: {id: user.id} }});
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, permission: ChannelMemberPermission.Muted });
				this.logger.log(`Channel ${channel.name} muted to ${user.username}`);
				await this.server.to(channel.name).emit('update_chat_user', 'You are muted from this channel');
				return channel;
			}
		}
	}

	//a finir pour les permissions
	@SubscribeMessage('unmuteChannel')
	async handleUnmuteChannel(@MessageBody() payload: { userId: number;  roomName: string;}) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id} , user: {id: user.id} }});
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, permission: ChannelMemberPermission.Regular });
				this.logger.log(`Channel ${channel.name} unmuted to ${user.username}`);
				await this.server.to(channel.name).emit('update_chat_user', 'You are muted from this channel');
				return channel;
			}
		}
	}

	@SubscribeMessage('promoteChannel')
	async handlePromoteChannel(@MessageBody() payload: { userId: number; roomName: string; }) {
		const channel =  await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id} , user: {id: user.id} }});
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, role: ChannelMemberRole.Admin });
				this.logger.log(`Channel ${channel.name} promoted to ${user.username}`);
				await this.server.to(channel.name).emit('update_chat_user', 'You are promoted from this channel');
				return channel;
			}
		}
	}

	@SubscribeMessage('demoteChannel')
	async handleDemoteChannel(@MessageBody() payload: { userId: number; roomName: string; }) {
		const channel =  await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id} , user: {id: user.id} }});
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, role: ChannelMemberRole.Regular });
				this.logger.log(`Channel ${channel.name} demoted to ${user.username}`);
				await this.server.to(channel.name).emit('update_chat_user', 'You are promoted from this channel');
				return channel;
			}
		}
	}

	@SubscribeMessage('disconnect_room')
	async handledisconnectRoomEvent(client: Socket, payload: {roomName: string}) {
		await this.chatService.removeUserFromRoom(client.id, payload.roomName);
		const room  = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const channelMember = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: room.id} , user: {socketId: client.id} }});
		this.dataSources.manager.save(ChannelMember, { id: channelMember.id, pass: false });
		this.logger.log(`${client.id} is disconnect rooms`);
	}

	@SubscribeMessage('change_password')
	async handleChangePasswordEvent(client: Socket, payload: {roomName: string, password: string}) {
		const room  = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		if (room && payload.password) {
			const clientChannel = await this.dataSources.manager.findOne(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: room.id} , user: {socketId: client.id} , role: ChannelMemberRole.Owner}});
			if (!clientChannel)
				return;
			const channel = await this.dataSources.manager.save(Channel, { id: room.id, passwordHash: await bcrypt.hash(payload.password, 10) });
			if (!channel)
				return;
			const channelMember = await this.dataSources.manager.find(ChannelMember, {relations: ['channel', 'user'], where: {channel: {id: channel.id} }});
			for (const element of channelMember) {
				this.dataSources.manager.save(ChannelMember, { id: element.id, pass: false });
			}
			this.logger.log(`Change password of room ${room.name}`);
			return room;
		}
	}

}