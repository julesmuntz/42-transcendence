import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMember } from '../entities/channel-menber.entity';
import { Repository } from 'typeorm';
import { CreateChannelMenberDto } from '../dto/create-channel-menber.dto';
import { UpdateChannelMenberDto } from '../dto/update-channel-menber.dto';

@Injectable()
export class ChannelMemberService {
	constructor(
		@InjectRepository(ChannelMember)
		private channelmenberRepository: Repository<ChannelMember>
	) {}

	async create(createChannelMenberDto: CreateChannelMenberDto) : Promise<ChannelMember> {
		const newchannelmenber = this.channelmenberRepository.create(createChannelMenberDto);
		return this.channelmenberRepository.save(newchannelmenber);
	}

	async findAll() : Promise<ChannelMember[]> {
		return this.channelmenberRepository.find();
	}

	async findOne(id: number) : Promise<ChannelMember> {
		return this.channelmenberRepository.findOne({where: {id}});
	}

	async update(id: number, updateChannelMenberDto: UpdateChannelMenberDto) : Promise<ChannelMember> {
		await this.channelmenberRepository.update(id, updateChannelMenberDto);
		return this.channelmenberRepository.findOne({where: {id}});
	}

	async delete(id: number) : Promise<void> {
		await this.channelmenberRepository.delete(id);
	}
}
