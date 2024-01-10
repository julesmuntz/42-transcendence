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
		console.log(this.chatsService.getRooms());
		return this.chatsService.getRooms();
	}

	@Public()
	@Get('rooms/:id')
	async getRoomById(@Param('id') id: string): Promise<Room> {
		const rooms = await this.chatsService.getRooms();
		const roomNane = await this.chatsService.getRoomByName(id);
		if (roomNane !== -1)
			return rooms[roomNane];
		else
			throw new NotFoundException("Room does not exit !");
	}
}
