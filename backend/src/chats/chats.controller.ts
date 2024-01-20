import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Room } from '../shared/chats.interface';
import { Public } from 'auth/decorator/public.decorator';
import { DataSource } from 'typeorm';
import { Channel, ChannelType } from 'channels/entities/channel.entity';
import { ChannelMember, ChannelMemberAccess } from 'channels/entities/channel-member.entity';
import { User } from 'users/entities/user.entity';

@Controller('chats')
export class ChatsController {
	constructor(private chatService: ChatsService,
		private dataSource:DataSource
		) { }

	@Public()
	@Get('rooms')
	async getAllRooms(): Promise<Room[]> {
		return this.chatService.getRooms();
	}

	@Public()
	@Get('roomsForUser/:id')
	async getRoomsForUser(@Param('id') id: number): Promise<Channel[]> {
		const user = await this.dataSource.manager.findOne(User, { where: { id: id } });
		const channel = await this.dataSource.manager.find(Channel);
		let validChannels = [];
		if (channel && user) {
			for (const element of channel) {
				const channelMember = await this.dataSource.manager.findOne(ChannelMember, { relations: ['channel', 'user'], where: { channel: { id: element.id }, user: { id: user.id }} });
				if (channelMember && channelMember.access !== ChannelMemberAccess.Banned)
					validChannels.push(element);
				else if (element.type !== ChannelType.Private && !channelMember)
					validChannels.push(element);
			}
			return channel;
		}
		else
			return undefined;
	}

	@Public()
	@Get('rooms/:id')
	async getRoomById(@Param('id') id: string): Promise<Room | undefined> {
		if(id === 'undefined')
			return undefined;
		const roomNane = await this.chatService.getRoomByName(id);
		if (roomNane)
			return roomNane;
		else
			return undefined;
	}
}


