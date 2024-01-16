import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMember } from '../entities/channel-member.entity';
import { Repository } from 'typeorm';
import { Channel } from 'channels/entities/channel.entity';


@Injectable()
export class ChannelMemberService {
	constructor(
		@InjectRepository(ChannelMember)
		private channelmemberRepository: Repository<ChannelMember>
	) { }


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


	async delete(id: number): Promise<void> {
		await this.channelmemberRepository.delete(id);
	}
}
