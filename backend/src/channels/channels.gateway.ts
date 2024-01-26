import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { ChatsService } from 'chats/chats.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io'
import { Channel, ChannelType } from './entities/channel.entity';
import { ChannelMember, ChannelMemberAccess, ChannelMemberPermission, ChannelMemberRole } from './entities/channel-member.entity';
import { DataSource, In } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Room } from 'chats/entities/chat.entity';
import * as bcrypt from 'bcrypt';
import { NotificationType } from 'sockets.service';

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
	async handleCreatingEvent(
		@MessageBody() payload: {
			createChannelDto: { name: string; type: ChannelType; passwordHash: string | undefined; };
			userId: string
		},
		@ConnectedSocket() socket: Socket
	) {
		const channelExist = await this.dataSources.manager.findOne(Channel, { where: { name: payload.createChannelDto.name } });
		const RoomExist = await this.dataSources.manager.findOne(Room, { where: { name: payload.createChannelDto.name } });
		if (!channelExist && !RoomExist && payload.createChannelDto.name.match(/^[a-zA-Z0-9]{0,20}$/)) {
			if (payload.createChannelDto.passwordHash)
				payload.createChannelDto.passwordHash = await bcrypt.hash(payload.createChannelDto.passwordHash, 10);
			const channel = await this.dataSources.manager.save(Channel, payload.createChannelDto);
			if (channel) {
				const user = await this.dataSources.manager.findOne(User, { where: { id: parseInt(payload.userId) } });
				if (user) {
					const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel, role: ChannelMemberRole.Owner })
					if (channelMember) {
						const room = await this.dataSources.manager.save(Room, { 'name': channel.name, host: { userId: parseInt(payload.userId), userName: user.username, socketId: '' }, users: [], message: [], channel: true, type: channel.type });
						if (room) {
							this.logger.log(`Channel ${channel.name} created`);
							if (channel.type === ChannelType.Private)
								socket.emit('updateChannelList', channel);
							else
								this.server.emit('updateChannelList', channel);
							return channel;
						}
					}
				}
			}
		}
		socket.emit('notification', {
			type: NotificationType.Error,
			message: 'Invalid channel',
		});
	}

	// suprimer channel
	@SubscribeMessage('deleteChannel')
	async handleDeletingEvent(@MessageBody() payload: { roomName: string },
		@ConnectedSocket() socket: Socket) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { socketId: socket.id }, role: ChannelMemberRole.Owner } });
		if (channel && memberOwner) {
			await this.dataSources.manager.delete(ChannelMember, { channel: channel });
			await this.dataSources.manager.delete(Channel, { id: channel.id });
			await this.dataSources.manager.delete(Room, { name: channel.name });
			this.logger.log(`Channel ${channel.name} deleted`);
			this.server.emit('deleteChannel');
			this.server.emit('updateListChannel');
			socket.emit('notification', {
				type: NotificationType.Success,
				message: 'Channel deleted',
			});
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
				const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: element.id }, user: { id: user.id } } });
				if (channelMember && channelMember.access !== ChannelMemberAccess.Banned)
					validChannels.push(element);
				else if (element.type !== ChannelType.Private && !channelMember)
					validChannels.push(element);
			}
			socket.emit('channelList', validChannels);
			this.logger.log(`emit server getChannel ${socket.id}`);
			return channel;
		}
	}

	@SubscribeMessage('inviteChannel')
	async handleInviteChannel(
		@MessageBody() payload: { userId: number; channelId: string; },
		@ConnectedSocket() socket: Socket
	) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.channelId } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { socketId: socket.id }, role: ChannelMemberRole.Owner } });
		if (channel && user && memberOwner) {
			const userExist = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (!userExist) {
				const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel });
				if (channelMember) {
					this.logger.log(`User "${user.username}" invited to Channel "${channel.name}"`);
					if (user.socketId !== '')
					{
						this.server.to(user.socketId).emit('updateListChannel', 'You are kick from this channel');
						this.server.to(user.socketId).emit('notification', {
							type: NotificationType.Info,
							message: 'You are invited to channel: ' + channel.name,
						});
					}
					socket.emit('notification', {
						type: NotificationType.Success,
						message: 'User invited',
					});
					return channel;
				}
			}
		}
	}

	@SubscribeMessage('joinChannel')
	async handleJoinChannel(
		@MessageBody() payload: { channelId: string; },
		@ConnectedSocket() socket: Socket
	) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.channelId } });
		const user = await this.dataSources.manager.findOne(User, { where: { socketId: socket.id } });
		if (channel && user) {
			const userExist = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (!userExist) {
				const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel });
				if (channelMember) {
					this.logger.log(`User "${user.username}" join to Channel "${channel.name}"`);
					socket.emit('passwordChannel', payload.channelId);
					return channel;
				}
			}
			else
				socket.emit('passwordChannel', payload.channelId);
		}
	}

	@SubscribeMessage('passwordChannel')
	async handlePasswordChannel(
		@MessageBody() payload: { channelId: string, password: string },
		@ConnectedSocket() socket: Socket
	) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.channelId } });
		const user = await this.dataSources.manager.findOne(User, { where: { socketId: socket.id } });
		if (channel && user) {
			console.log(channel);
			const compare = await bcrypt.compare(payload.password, channel.passwordHash);
			if (compare) {
				const userExist = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
				if (!userExist) {
					const channelMember = await this.dataSources.manager.save(ChannelMember, { user: user, channel: channel, pass: true });
					if (channelMember) {
						this.logger.log(`User "${user.username}" join to Channel "${channel.name}"`);
						socket.emit('passwordChannel', payload.channelId);
						return channel;
					}
				}
				else {
					await this.dataSources.manager.save(ChannelMember, { id: userExist.id, pass: true });
					socket.emit('passwordChannel', payload.channelId);
				}

			}
		}
	}

	@SubscribeMessage('kickChannel')
	async handleKickChannel(
		@MessageBody() payload: { userId: number; roomName: string; },
		@ConnectedSocket() socket: Socket
	) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: In([ChannelMemberRole.Owner, ChannelMemberRole.Admin]),
			},
		});
		if (channel && user && memberOwner) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } }); //personne a kixck
			if (channelMember && channelMember.role !== ChannelMemberRole.Owner && memberOwner.role === ChannelMemberRole.Owner) {
				await this.dataSources.manager.delete(ChannelMember, { id: channelMember.id });
				this.logger.log(`Channel ${channel.name} kicked to ${user.username}`);
				if (user.socketId !== '') {
					this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
					this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
					if (user.socketId !== '') {
						this.server.to(user.socketId).emit('banned', 'You are kick from this channel');
						this.server.to(user.socketId).emit('updateListChannel', 'You are kick from this channel');
						this.server.to(user.socketId).emit('notification', {
							type: NotificationType.Warning,
							message: 'You are kick from channel: ' + channel.name,
							});
					}
				}
			} else if (channelMember && memberOwner.role === ChannelMemberRole.Admin && channelMember.role === ChannelMemberRole.Regular) {
				await this.dataSources.manager.delete(ChannelMember, { id: channelMember.id });
				this.logger.log(`Channel ${channel.name} kicked to ${user.username}`);
				if (user.socketId !== '') {
					this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
					this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
					if (user.socketId !== '') {

						this.server.to(user.socketId).emit('banned', 'You are kick from this channel');
						this.server.to(user.socketId).emit('updateListChannel', 'You are kick from this channel');
						this.server.to(user.socketId).emit('notification', {
							type: NotificationType.Warning,
							message: 'You are kick from channel: ' + channel.name,
							});
					}
				}
			}
		}
	}

	@SubscribeMessage('banChannel')
	async handleBanChannel(
		@MessageBody() payload: { userId: number; roomName: string; },
		@ConnectedSocket() socket: Socket
	) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: In([ChannelMemberRole.Owner, ChannelMemberRole.Admin]),
			},
		});
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (channelMember && channelMember.role !== ChannelMemberRole.Owner && memberOwner.role === ChannelMemberRole.Owner) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, access: ChannelMemberAccess.Banned });
				this.logger.log(`Channel ${channel.name} banned to ${user.username}`);
				if (user.socketId !== '') {
					this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
					if (user.socketId !== '') {
						this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
						this.server.to(user.socketId).emit('banned', 'You are kick from this channel');
						this.server.to(user.socketId).emit('updateListChannel', 'You are kick from this channel');
					}
				}
				return channel;
			}
			else if (channelMember && memberOwner.role === ChannelMemberRole.Admin && channelMember.role === ChannelMemberRole.Regular) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, access: ChannelMemberAccess.Banned });
				this.logger.log(`Channel ${channel.name} banned to ${user.username}`);
				if (user.socketId !== '') {
					this.server.in(user.socketId).socketsLeave(channel.name);
					await this.chatService.removeUserFromRoom(user.socketId, channel.name);
					if (user.socketId !== '') {
						this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
						this.server.to(user.socketId).emit('banned', 'You are kick from this channel');
						this.server.to(user.socketId).emit('updateListChannel', 'You are kick from this channel');
					}
				}
				return channel;
			}
		}
	}

	@SubscribeMessage('unbanChannel')
	async handleUnbanChannel(
		@MessageBody() payload: { userId: number; roomName: string; },
		@ConnectedSocket() socket: Socket
	) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: In([ChannelMemberRole.Owner, ChannelMemberRole.Admin]),
			},
		});
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (channelMember && channelMember.role !== ChannelMemberRole.Owner && memberOwner.role === ChannelMemberRole.Owner) {
				await this.dataSources.manager.delete(ChannelMember, { id: channelMember.id });
				this.logger.log(`Channel ${channel.name} unbanned to ${user.username}`);
				this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
				if (channel.type !== ChannelType.Private && user.socketId !== '')
					this.server.to(user.socketId).emit('updateChannelList', channel);
				return channel;
			}
			else if (channelMember && memberOwner.role === ChannelMemberRole.Admin && channelMember.role === ChannelMemberRole.Regular) {
				await this.dataSources.manager.delete(ChannelMember, { id: channelMember.id });
				this.logger.log(`Channel ${channel.name} unbanned to ${user.username}`);
				this.server.to(payload.roomName).emit('update_chat_user', 'You are kick from this channel');
				if (channel.type !== ChannelType.Private && user.socketId !== '')
					this.server.to(user.socketId).emit('updateChannelList', channel);
				return channel;
			}
		}
	}

	//a finir pour les permissions
	@SubscribeMessage('muteChannel')
	async handleMuteChannel(@MessageBody() payload: { userId: number; roomName: string; },
		@ConnectedSocket() socket: Socket) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: In([ChannelMemberRole.Owner, ChannelMemberRole.Admin]),
			},
		});
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (channelMember && memberOwner && channelMember.role !== ChannelMemberRole.Owner) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, permission: ChannelMemberPermission.Muted });
				this.logger.log(`Channel ${channel.name} muted to ${user.username}`);
				this.server.to(channel.name).emit('update_chat_user', 'You are muted from this channel');
				return channel;
			}
		}
	}

	//a finir pour les permissions
	@SubscribeMessage('unmuteChannel')
	async handleUnmuteChannel(@MessageBody() payload: { userId: number; roomName: string; },
		@ConnectedSocket() socket: Socket) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: In([ChannelMemberRole.Owner, ChannelMemberRole.Admin]),
			},
		});
		if (channel && user) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (channelMember && memberOwner) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, permission: ChannelMemberPermission.Regular });
				this.logger.log(`Channel ${channel.name} unmuted to ${user.username}`);
				this.server.to(channel.name).emit('update_chat_user', 'You are muted from this channel');
				return channel;
			}
		}
	}

	@SubscribeMessage('promoteChannel')
	async handlePromoteChannel(@MessageBody() payload: { userId: number; roomName: string; }, @ConnectedSocket() socket: Socket) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: ChannelMemberRole.Owner
			},
		});
		if (channel && user && memberOwner) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, role: ChannelMemberRole.Admin });
				this.logger.log(`Channel ${channel.name} promoted to ${user.username}`);
				this.server.to(channel.name).emit('update_chat_user', 'You are promoted from this channel');
				return channel;
			}
		}
	}

	@SubscribeMessage('demoteChannel')
	async handleDemoteChannel(@MessageBody() payload: { userId: number; roomName: string; }, @ConnectedSocket() socket: Socket) {
		const channel = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const user = await this.dataSources.manager.findOne(User, { where: { id: payload.userId } });
		const memberOwner = await this.dataSources.manager.findOne(ChannelMember, {
			relations: ['channel', 'user'],
			where: {
				channel: { id: channel.id },
				user: { socketId: socket.id },
				role: ChannelMemberRole.Owner
			},
		});
		if (channel && user && memberOwner) {
			const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id }, user: { id: user.id } } });
			if (channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, role: ChannelMemberRole.Regular });
				this.logger.log(`Channel ${channel.name} demoted to ${user.username}`);
				this.server.to(channel.name).emit('update_chat_user', 'You are promoted from this channel');
				return channel;
			}
		}
	}

	@SubscribeMessage('disconnectRoom')
	async handledisconnectRoomEvent(client: Socket, payload: { roomName: string }) {
		await this.chatService.removeUserFromRoom(client.id, payload.roomName);
		const room = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName } });
		const channelMember = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: room.id }, user: { socketId: client.id } } });
		await this.dataSources.manager.save(ChannelMember, { id: channelMember.id, pass: false });
		this.logger.log(`${client.id} is disconnect rooms`);
	}

	@SubscribeMessage('changePassword')
	async handleChangePasswordEvent(client: Socket, payload: { roomName: string, password: string },) {
		const room = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName, type: ChannelType.Protected } });
		if (room && payload.password) {
			const clientChannel = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: room.id }, user: { socketId: client.id }, role: ChannelMemberRole.Owner } });
			if (!clientChannel)
				return;
			const channel = await this.dataSources.manager.save(Channel, { id: room.id, passwordHash: await bcrypt.hash(payload.password, 10) });
			if (!channel)
				return;
			const channelMember = await this.dataSources.manager.find(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: channel.id } } });
			for (const element of channelMember) {
				await this.dataSources.manager.save(ChannelMember, { id: element.id, pass: false });
			}
			this.logger.log(`Change password of room ${room.name}`);
			return room;
		}
	}

	@SubscribeMessage('changeType')
	async handleChangeTypeEvent(client: Socket, payload: { roomName: string },) {
		const rooma = await this.dataSources.manager.findOne(Channel, { where: { name: payload.roomName, type: ChannelType.Protected } });
		if (rooma) {
			const clientChannel = await this.dataSources.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: rooma.id }, user: { socketId: client.id }, role: ChannelMemberRole.Owner } });
			if (!clientChannel)
				return;
			const channel = await this.dataSources.manager.save(Channel, { id: rooma.id, type: ChannelType.Public, passwordHash: null });
			if (!channel)
				return;
			const Roomid = await this.dataSources.manager.findOne(Room, { where: { name: payload.roomName } });
			if (!Roomid)
				return;
			const room = await this.dataSources.manager.save(Room, { id: Roomid.id, type: ChannelType.Public });
			if (!room)
				return;
			this.logger.log(`Change type of room ${rooma.name}`);
			this.server.to(payload.roomName).emit('type')
			this.server.emit('updateListChannel');
			return room;
		}
	}
}
