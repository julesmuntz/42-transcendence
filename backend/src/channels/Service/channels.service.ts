import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>
	) {}

	async create(createChannelDto: CreateChannelDto) : Promise<Channel> {
		const newchannel = this.channelRepository.create(createChannelDto);
		return this.channelRepository.save(newchannel);
	}

	async findAll() : Promise<Channel[]> {
		return this.channelRepository.find();
	}

	async findOne(id: number) : Promise<Channel> {
		return this.channelRepository.findOne({where: {id}});
	}

	async update(id: number, updateChannelDto: UpdateChannelDto) : Promise<Channel> {
		await this.channelRepository.update(id, updateChannelDto);
		return this.channelRepository.findOne({where: {id}});
	}

	async delete(id: number) : Promise<void> {
		await this.channelRepository.delete(id);
	}
}


// create channel service
// channel public, protected, private
// si public, pas de password
// si protected, password
// si private, password, plus un champ pour les invités
