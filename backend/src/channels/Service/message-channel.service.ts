import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageChannel } from '../entities/message-channel.entity';
import { Repository } from 'typeorm';
import { CreateMessageChannelDto } from '../dto/create-message-channel.dto';
import { UpdateMessageChannelDto } from '../dto/update-message-channel.dto';

@Injectable()
export class MessageChannelService {
	constructor(
		@InjectRepository(MessageChannel)
		private messagechannelRepository: Repository<MessageChannel>
	) {}

	async create(createMessageChannelDto: CreateMessageChannelDto) : Promise<MessageChannel> {
		const newmesagechannel = this.messagechannelRepository.create(createMessageChannelDto);
		return this.messagechannelRepository.save(newmesagechannel);
	}

	async findAll() : Promise<MessageChannel[]> {
		return this.messagechannelRepository.find();
	}

	async findOne(id: number) : Promise<MessageChannel> {
		return this.messagechannelRepository.findOne({where: {id}});
	}

	async update(id: number, updateMessageChannelDto: UpdateMessageChannelDto) : Promise<MessageChannel> {
		await this.messagechannelRepository.update(id, updateMessageChannelDto);
		return this.messagechannelRepository.findOne({where: {id}});
	}

	async delete(id: number) : Promise<void> {
		await this.messagechannelRepository.delete(id);
	}
}
