import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Req } from '@nestjs/common';
import { ChannelsService } from '../Service/channels.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { Channel } from '../entities/channel.entity';
import { ChannelMemberService } from 'channels/Service/channel-member.service';
import { ChatsService } from 'chats/chats.service';
import { UsersService } from 'users/users.service';
import { CreateChannelMenberDto } from 'channels/dto/create-channel-menber.dto';

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService, private readonly channelUser: ChannelMemberService, private readonly chatService: ChatsService, private readonly userService: UsersService) {}

	@Post()
	async create(@Body() body :{createChannelDto: CreateChannelDto}, @Req() req : any) : Promise<Channel> {
		console.log(body.createChannelDto);
		const channelExist = await this.channelsService.findOneByName(body.createChannelDto.name);
		if (!channelExist) {
			const channel = await this.channelsService.create(body.createChannelDto);
			if (channel) {
				const user = await this.userService.findOne(req.user.sub);
				if (user) {
					const createChannelMemberDto = {
						'user': user,
						'channel': channel,
						'role': 'owner',
					}
					const channelMember = await this.channelUser.create(createChannelMemberDto as CreateChannelMenberDto);
					if (channelMember) {
						const room = await this.chatService.addRoom(channel.name, {
							'userId': req.user.sub,
							'userName': req.user.users.username,
							'socketId': '',
						});
						if (room) {
							const update = await this.channelsService.update(channel.id, {
								'roomId': room,
							});
							if (update) {
								return channel;
							}
						}
					}
				}
			}
		}
		console.log("Channel already exist !");
	}

	@Get()
	async findAll() : Promise<Channel[]> {
		return this.channelsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) : Promise<Channel> {
		const channel = await this.channelsService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Channel does not exit !");
		} else {
			return  channel;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) : Promise<any> {
		return this.channelsService.update(id, updateChannelDto);
	}

	// delete aussi les users de la table channel-member et les rooms de la table chat en meme temps
	@Delete(':id')
	async delete(@Param('id') id: number) {
		const channel = await this.channelsService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Channel does not exit !");
		} else {
			return this.channelsService.delete(id);
		}
	}
}
