import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel, ChannelType } from '../entities/channel.entity';
import { ChannelMemberService } from './channel-member.service';

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		private readonly channelsUser: ChannelMemberService,
	) { }

	async findAll(): Promise<Channel[]> {
		return this.channelRepository.find();
	}

	async findOne(id: number): Promise<Channel> {
		return this.channelRepository.findOne({ where: { id } });
	}

	async findOneByName(name: string): Promise<Channel> {
		return this.channelRepository.findOne({ where: { name } });
	}

	async findAllType(type: ChannelType): Promise<Channel[]> {
		return this.channelRepository.find({ where: { type } });
	}





	async delete(id: number): Promise<void> {
		await this.channelRepository.delete(id);
	}
}
