import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelsService } from 'channels/Service/channels.service';
import { CreateChannelDto } from 'channels/dto/create-channel.dto';
import { SocketsService } from 'sockets.service';
import { UsersService } from 'users/users.service';
import { ChannelMemberService } from 'channels/Service/channel-member.service';
import { ChatsService } from 'chats/chats.service';
import { CreateChannelMemberDto } from 'channels/dto/create-channel-member.dto';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io'
import { ChannelType } from './entities/channel.entity';


@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway {
	constructor(
		private readonly channelsService: ChannelsService,
		// private readonly socketService: SocketsService,
		private readonly userService: UsersService,
		private readonly channelUser: ChannelMemberService,
		private readonly chatService: ChatsService,
	)
	{}

	@WebSocketServer() server: Server;
	private logger = new Logger('ChannelsGateway');

	// create channel
	@SubscribeMessage('createChannel')
	async handleCreatingEvent(@MessageBody() payload: { createChannelDto: CreateChannelDto; userId: string })  {
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
							this.server.emit('updateChannelList', channel);
							return channel;
						} else {
							console.log("Error: room not created !");
						}
					}
				}
			}
		}
		// console.log("Channel already exist !");
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
	async handleGetChannelListPublic() {
		const channels = await this.channelsService.findAllType(ChannelType.Public);
		console.log("getChannelListPublic");
		if (channels) {
			this.logger.log(`emit server channelPublic`);
			this.server.emit('channelPublic', channels);
			return channels;
		}
	}

	@SubscribeMessage('getChannelListProtected')
	async handleGetChannelListProtected() {
		const channels = await this.channelsService.findAllType(ChannelType.Protected);
		console.log("getChannelListProtected");
		if (channels) {
			this.logger.log(`emit server channelProtected`);
			this.server.emit('channelProtected', channels);
			return channels;
		}
	}


}