import { Controller, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Room } from '../shared/chats.interface';


@Controller('chats')
export class ChatsController {
	constructor(private chatService: ChatsService,
		) { }

	@Get('rooms')
	async getAllRooms(): Promise<Room[]> {
		return this.chatService.getRooms();
	}

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


