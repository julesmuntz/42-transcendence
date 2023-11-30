import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Controller('chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) {}

	@Post()
	async create(@Body() createChatDto: CreateChatDto) : Promise<Chat> {
		return this.chatsService.create(createChatDto);
	}

	@Get()
	async findAll() : Promise<Chat[]> {
		return this.chatsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) : Promise<Chat> {
		const chat = await this.chatsService.findOne(id);
		if (!chat) {
			throw new NotFoundException("Chat does not exit !");
		} else {
			return chat;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChatDto: UpdateChatDto) : Promise<any> {
		return this.chatsService.update(id, updateChatDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const chat = await this.chatsService.findOne(id);
		if (!chat) {
			throw new NotFoundException("Chat does not exit !");
		} else {
			return this.chatsService.delete(id);
		}
	}
}
