import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend } from './entities/friend.entity';
import { UsersService } from 'users/users.service';


@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
		private readonly userService: UsersService
	) {}

	async create(createFriendDto: Friend): Promise<Friend> {
		const newfriend = this.friendRepository.create(createFriendDto);
		return this.friendRepository.save(newfriend);
	}

	async findAll(): Promise<Friend[]> {
		const friends = await this.friendRepository.find(
			{
			relations: ["user1", "user2"],
			where : {
				user1: {
					id: 2
				}
			}
		  });
		  console.log(friends);
		return this.friendRepository.find();
	}

	async findOne(id: number): Promise<Friend> {
		return this.friendRepository.findOne({where: {id}});
	}

	async update(id: number, updateFriendDto: UpdateFriendDto): Promise<any> {
		await this.friendRepository.update(id, updateFriendDto);
		return this.friendRepository.findOne({where: {id}});
	}

	async delete(id: number): Promise<void> {
		await this.friendRepository.delete(id);
	}

	// async findInvite(user2Id: number) : Promise<Friend[]> {
	// 	return this.friendRepository.find({
	// 		where: {
	// 			user2_id: user2Id,
	// 		},
	// 	});
	// }
}
