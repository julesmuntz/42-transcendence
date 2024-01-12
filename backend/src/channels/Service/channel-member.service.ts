import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMember, ChannelMemberAccess } from '../entities/channel-member.entity';
import { Repository } from 'typeorm';
import { CreateChannelMemberDto } from '../dto/create-channel-member.dto';
import { UpdateChannelMemberDto } from '../dto/update-channel-member.dto';
import { Channel } from 'channels/entities/channel.entity';
import { User } from 'users/entities/user.entity';

@Injectable()
export class ChannelMemberService {
	constructor(
		@InjectRepository(ChannelMember)
		private channelmemberRepository: Repository<ChannelMember>
	) { }

	async create(CreateChannelMemberDto: CreateChannelMemberDto): Promise<ChannelMember> {

		const newchannelmember = this.channelmemberRepository.create(CreateChannelMemberDto);
		return this.channelmemberRepository.save(newchannelmember);
	}

	async findAll(): Promise<ChannelMember[]> {
		return this.channelmemberRepository.find({ relations: ["user"] });
	}

	async findOne(id: number): Promise<ChannelMember> {
		return this.channelmemberRepository.findOne({ where: { id } });
	}

	//bug fonction pas encore utilisé
	async findOneByChannelAndUser(channel: Channel, userId: number): Promise<ChannelMember> {
		return this.channelmemberRepository.findOne({
			relations: ["user", "channel"], // Assurez-vous de charger également la relation du canal
			where: {
				user: { id: userId },
				channel: { id: channel.id } // Assurez-vous de comparer les IDs du canal
			}
		});
	}

	async findOneByChannel(channelId: string): Promise<ChannelMember> {
		return this.channelmemberRepository.findOne({
			relations: ['channel'],
			where: { channel: { name: channelId } }
		});
	}

	async findAllByChannel(channel: Channel): Promise<ChannelMember[]> {
		return this.channelmemberRepository.find({ where: { channel } });
	}

	async findAllByChannelName(channelId: string): Promise<ChannelMember[]> {
		return this.channelmemberRepository.find({
			relations: ['channel', 'user'],
			where: { channel: { name: channelId } }
		});
	}

	async findOneByChannelNameAndUser(channelId: string, userId: number): Promise<ChannelMember> {
		return this.channelmemberRepository.findOne({
			relations: ["user", "channel"], // Assurez-vous de charger également la relation du canal
			where: {
				user: { id: userId },
				channel: { name: channelId } // Assurez-vous de comparer les IDs du canal
			}
		});
	}

	async update(id: number, updateChannelMemberDto: UpdateChannelMemberDto): Promise<ChannelMember> {
		await this.channelmemberRepository.update(id, updateChannelMemberDto);
		return this.channelmemberRepository.findOne({ where: { id } });
	}

	async delete(id: number): Promise<void> {
		await this.channelmemberRepository.delete(id);
	}
}
