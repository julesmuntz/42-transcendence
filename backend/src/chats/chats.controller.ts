import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Room } from '../shared/chats.interface';
import { Public } from 'auth/decorator/public.decorator';

@Controller('chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) { }

	@Public()
	@Get('rooms')
	async getAllRooms(): Promise<Room[]> {
		return this.chatsService.getRooms();
	}

	@Public()
	@Get('rooms/:id')
	async getRoomById(@Param('id') id: string): Promise<Room> {
		const roomNane = await this.chatsService.getRoomByName(id);
		if (roomNane)
			return roomNane;
		else
			throw new NotFoundException("Room does not exit !");
	}
}
