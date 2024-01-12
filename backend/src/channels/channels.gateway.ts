import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelsService } from 'channels/Service/channels.service';
import { CreateChannelDto } from 'channels/dto/create-channel.dto';
import { UsersService } from 'users/users.service';
import { ChannelMemberService } from 'channels/Service/channel-member.service';
import { ChatsService } from 'chats/chats.service';
import { CreateChannelMemberDto } from 'channels/dto/create-channel-member.dto';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io'
import { ChannelType } from './entities/channel.entity';
import { UserRoom } from "../shared/chats.interface";
import { ChannelMemberAccess, ChannelMemberPermission } from './entities/channel-member.entity';
import e from 'express';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway {
	constructor(
		private readonly channelsService: ChannelsService,
		// private socketService: SocketsService,
		private readonly userService: UsersService,
		private readonly channelUser: ChannelMemberService,
		private chatService: ChatsService,
	) { }

	@WebSocketServer() server: Server;
	private logger = new Logger('ChannelsGateway');

	// create channel
	@SubscribeMessage('createChannel')
	async handleCreatingEvent(@MessageBody() payload: { createChannelDto: CreateChannelDto; userId: string }) {
		const channelExist = await this.channelsService.findOneByName(payload.createChannelDto.name);
		if (!channelExist) {
			const channel = await this.channelsService.create(payload.createChannelDto);
			if (channel) {
				const user = await this.userService.findOne(parseInt(payload.userId));
				if (user) {
					const createChannelMemberDto = {
						'user': user,
						'channel': channel,
						'role': 'owner',
					}
					const channelMember = await this.channelUser.create(createChannelMemberDto as CreateChannelMemberDto);
					if (channelMember) {
						const room = await this.chatService.addRoom(channel.name, {
							'userId': parseInt(payload.userId),
							'userName': user.username,
							'socketId': '',
						}, true);
						if (room) {
							this.logger.log(`Channel ${channel.name} created`);
							if (channel.type === ChannelType.Public)
								this.server.emit('updateChannelListPublic', channel);
							else if (channel.type === ChannelType.Protected)
								this.server.emit('updateChannelListProtected', channel);
							else if (channel.type === ChannelType.Private)
								this.server.to(user.socketId).emit('updateChannelListPrivate', channel);

							return channel;
						} else {
							console.log("Error: room not created !");
						}
					}
				}
			}
		}
	}

	// suprimer channel
	@SubscribeMessage('deleteChannel')
	async handleDeletingEvent(@MessageBody() payload: { channelId: number }) {
		const channel = await this.channelsService.findOne(payload.channelId);
		if (channel) {
			const channelMember = await this.channelUser.findAllByChannel(channel);
			if (channelMember) {
				channelMember.forEach(async (element) => {
					await this.channelUser.delete(element.id);
				});
			}
			await this.channelsService.delete(channel.id);
			await this.chatService.removeRoom(channel.name);
			this.logger.log(`Channel ${channel.name} deleted`);
			this.server.emit('deleteChannel', channel);
			return channel;
		}
	}

	//get all channel
	@SubscribeMessage('getChannelListPublic')
	async handleGetChannelListPublic(socket: Socket) {
		const channels = await this.channelsService.findAllType(ChannelType.Public);
		const user = await this.userService.findOneBySocketId(socket.id);
		let validChannels = [];

		if (channels && user) {
			for (const element of channels) {
				const channelMember = await this.channelUser.findOneByChannelAndUser(element, user.id);
				if (channelMember && channelMember.access !== ChannelMemberAccess.Banned) {
					validChannels.push(element);
				}
				else if (!channelMember) {
					validChannels.push(element);
				}
			}
		this.logger.log(`emit server channelPublic `, socket.id);
		this.server.to(socket.id).emit('channelPublic', validChannels);
		return channels;
		}
	}

	@SubscribeMessage('getChannelListPrivate')
	async handleGetChannelListPrivate(socket: Socket) {
		const channels = await this.channelsService.findAllType(ChannelType.Private);
		const user = await this.userService.findOneBySocketId(socket.id);
		let validChannels = [];

		if (channels && user) {
			for (const element of channels) {
				const channelMember = await this.channelUser.findOneByChannelAndUser(element, user.id);
				if (channelMember && channelMember.access !== ChannelMemberAccess.Banned) {
					validChannels.push(element);
				}
			}
		this.logger.log(`emit server channelPrivate `, socket.id);
		this.server.to(socket.id).emit('channelPrivate', validChannels);
		return channels;
		}
	}


	@SubscribeMessage('getChannelListProtected')
	async handleGetChannelListProtected(socket: Socket) {
		const channels = await this.channelsService.findAllType(ChannelType.Protected);
		const user = await this.userService.findOneBySocketId(socket.id);
		let validChannels = [];

		if (channels && user) {
			for (const element of channels) {
				const channelMember = await this.channelUser.findOneByChannelAndUser(element, user.id);
				if (channelMember && channelMember.access !== ChannelMemberAccess.Banned) {
					validChannels.push(element);
				}
				else if (!channelMember) {
					validChannels.push(element);
				}
			}
		this.logger.log(`emit server channelProtected `, socket.id);
		this.server.to(socket.id).emit('channelProtected', validChannels);
		return channels;
		}
	}

	//verifier si le user est dans la room
	@SubscribeMessage('inviteChannels')
	async handleInviteChannels(@MessageBody() payload: { userId: number; channelId: number; }) {
		console.log("USER INVITED")
		const channel = await this.channelsService.findOne(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const userExist = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (!userExist) {
				const createChannelMemberDto = {
					'user': user,
					'channel': channel,
					'role': 'regular',
					'access': 'regular',
					'permission': 'regular',
				}
				const channelMember = await this.channelUser.create(createChannelMemberDto as CreateChannelMemberDto);
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
		const channel = await this.channelsService.findOneByName(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const userExist = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (!userExist) {
				const createChannelMemberDto = {
					'user': user,
					'channel': channel,
					'role': 'regular',
					'access': 'regular',
					'permission': 'regular',
				}
				const channelMember = await this.channelUser.create(createChannelMemberDto as CreateChannelMemberDto);
				if (channelMember) {
					this.logger.log(`User "${user.username}" join to Channel "${channel.name}"`);
					return channel;
				}
			}
		}
	}

	@SubscribeMessage('kickChannel')
	async handleKickChannel(@MessageBody() payload: { userId: number; channelId: number; }) {
		const channel = await this.channelsService.findOne(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const channelMember = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (channelMember) {
				await this.channelUser.delete(channelMember.id);
				this.logger.log(`Channel ${channel.name} kicked to ${user.username}`);
				if (user.socketId !== '') {
					await this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
				}
				return channel;
			}
		}
	}

	@SubscribeMessage('banChannel')
	async handleBanChannel(@MessageBody() payload: { userId: number; channelId: number; }) {
		const channel = await this.channelsService.findOne(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const channelMember = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (channelMember) {
				await this.channelUser.update(channelMember.id, { access: ChannelMemberAccess.Banned });
				this.logger.log(`Channel ${channel.name} banned to ${user.username}`);
				if (user.socketId !== '') {
					await this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
				}
				return channel;
			}
		}
	}

	@SubscribeMessage('unbanChannel')
	async handleUnbanChannel(@MessageBody() payload: { userId: number; channelId: number; }) {
		const channel = await this.channelsService.findOne(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const channelMember = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (channelMember) {
				await this.channelUser.delete(channelMember.id);
				this.logger.log(`Channel ${channel.name} unbanned to ${user.username}`);
				return channel;
			}
		}
	}

	//a finir pour les permissions
	@SubscribeMessage('muteChannel')
	async handleMuteChannel(@MessageBody() payload: { userId: number; channelId: number; }) {
		const channel = await this.channelsService.findOne(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const channelMember = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (channelMember) {
				await this.channelUser.update(channelMember.id, { permission: ChannelMemberPermission.Muted });
				this.logger.log(`Channel ${channel.name} muted to ${user.username}`);
				return channel;
			}
		}
	}

	//a finir pour les permissions
	@SubscribeMessage('unmuteChannel')
	async handleUnmuteChannel(@MessageBody() payload: { userId: number; channelId: number; }) {
		const channel = await this.channelsService.findOne(payload.channelId);
		const user = await this.userService.findOne(payload.userId);
		if (channel && user) {
			const channelMember = await this.channelUser.findOneByChannelAndUser(channel, user.id);
			if (channelMember) {
				await this.channelUser.update(channelMember.id, { permission: ChannelMemberPermission.Regular });
				this.logger.log(`Channel ${channel.name} unmuted to ${user.username}`);
				return channel;
			}
		}
	}

	@SubscribeMessage('leave_room')
	async handleLeaveRoomEvent(@MessageBody() payload: { user: UserRoom; roomName: string; }) {
		if (payload.user.socketId) {
			console.log("leave_room", payload.user.socketId, payload.roomName);
			this.logger.log(`${payload.user.socketId} is leaving ${payload.roomName}`);
			await this.server.in(payload.user.socketId).socketsLeave(payload.roomName);
			await this.chatService.removeUserFromRoom(payload.user.socketId, payload.roomName);
			await this.channelsService.removeUserFromChannel(payload.user.userId, payload.roomName);
		}
	}

}