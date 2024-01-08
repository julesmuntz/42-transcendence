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
import { InjectDataSource } from '@nestjs/typeorm';


@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway {
	constructor(
		@InjectDataSource()
		private readonly channelsService: ChannelsService,
		// private readonly socketService: SocketsService,
		private readonly userService: UsersService,
		private readonly channelUser: ChannelMemberService,
		private readonly chatService: ChatsService,
	)
	{ }
	
	@WebSocketServer() server: Server;
	private logger = new Logger('ChannelsGateway');

	//check avant de cree que il exsite pas !
	@SubscribeMessage('createChannel')
	async handleCreatingEvent(@MessageBody() playload: { createChannelDto: CreateChannelDto; userId: string }) {
		this.logger.log(`Received message: ${playload}`);
		// console.log(this.socketService.getSocket(playload.userId));
		console.log(playload.createChannelDto.name);
		const channelExist = await this.channelsService.findOneByName(playload.createChannelDto.name);
		if (!channelExist) {
			const channel = await this.channelsService.create(playload.createChannelDto);
			if (channel) {
				const user = await this.userService.findOne(parseInt(playload.userId));
				if (user) {
					const createChannelMemberDto = {
						'user': user,
						'channel': channel,
						'role': 'owner',
					}
					const channelMember = await this.channelUser.create(createChannelMemberDto as CreateChannelMemberDto);
					if (channelMember) {
						const room = await this.chatService.addRoom(channel.name, {
							'userId': parseInt(playload.userId),
							'userName': user.username,
							'socketId': '',
						}, true);
						if (room) {
							// si cree emit au client les updade de channel; 
							return channel;
						} else {
							console.log("Error: room not created !");
						}
					}
				}
			}
		}
		console.log("Channel already exist !");
	}
}