import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, RelationType } from './entities/friend.entity';
import { UsersService } from 'users/users.service';


@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>
		) {}

	async create(createFriendDto: CreateFriendDto): Promise<Friend> {
		const newfriend = this.friendRepository.create(createFriendDto);
		return this.friendRepository.save(newfriend);
	}

	async findAll(): Promise<Friend[]> {
		return this.friendRepository.find();
	}

	async findOne(id: number): Promise<Friend> {
		return this.friendRepository.findOne({where: {id}});
	}

	async findInvite(id: number) : Promise<Friend[]> {
		return this.friendRepository.find(
			{
			relations: ["user1", "user2"],
			where : {
				user2: {id},
				type: RelationType.Invited
			}
		});
	}

	async addFriend(id: number) : Promise<any> {
		await this.friendRepository.update(id, {type: RelationType.Friend});
		return this.friendRepository.findOne({where: {id}});
	}

	async update(id: number, updateFriendDto: UpdateFriendDto): Promise<any> {
		await this.friendRepository.update(id, updateFriendDto);
		return this.friendRepository.findOne({where: {id}});
	}

	async delete(id: number): Promise<void> {
		await this.friendRepository.delete(id);
	}


}
