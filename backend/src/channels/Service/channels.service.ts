import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { Channel, ChannelType } from '../entities/channel.entity';
import * as bcrypt from 'bcrypt';
import { ChannelMemberService } from './channel-member.service';
import { ChannelMemberAccess } from 'channels/entities/channel-member.entity';

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		private readonly channelsUser: ChannelMemberService,
	) { }

	async create(createChannelDto: CreateChannelDto): Promise<Channel> {
		if (createChannelDto.passwordHash)
			createChannelDto.passwordHash = await bcrypt.hash(createChannelDto.passwordHash, 10);
		const newchannel = this.channelRepository.create(createChannelDto);
		return this.channelRepository.save(newchannel);
	}

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

	async update(id: number, updateChannelDto: UpdateChannelDto): Promise<Channel> {
		await this.channelRepository.update(id, updateChannelDto);
		return this.channelRepository.findOne({ where: { id } });
	}

	async removeUserFromChannel(userId: number, channelsName: string): Promise<void> {
		const channel = await this.findOneByName(channelsName);
		if (channel) {
			const channelUser = await this.channelsUser.findOneByChannelAndUser(channel, userId);
			if (channelUser) {
				await this.channelsUser.delete(channelUser.id);
			}
		}
	}

	async delete(id: number): Promise<void> {
		await this.channelRepository.delete(id);
	}
}
