import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>
	) {}

	async create(createChatDto: CreateChatDto) : Promise<Chat> {
		const newchat = this.chatRepository.create(createChatDto);
		return this.chatRepository.save(newchat);
	}

	async findAll() : Promise<Chat[]> {
		return this.chatRepository.find();
	}

	async findOne(id: number) : Promise<Chat> {
		return this.chatRepository.findOne({where: {id}});
	}

	async update(id: number, updateChatDto: UpdateChatDto) : Promise<Chat> {
		await this.chatRepository.update(id, updateChatDto);
		return this.chatRepository.findOne({where: {id}});
	}

	async delete(id: number) : Promise<void> {
		await this.chatRepository.delete(id);
	}
}
