import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, RelationType } from './entities/friend.entity';
import { ChatsService } from 'chats/chats.service';

@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
		private readonly chatsService: ChatsService
		) {}

	async create(createFriendDto: CreateFriendDto): Promise<Friend> {
		const newfriend = this.friendRepository.create(createFriendDto);
		return this.friendRepository.save(newfriend);
	}

	async findAll(): Promise<Friend[]> {
		return this.friendRepository.find({relations: ["user1", "user2"]});
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
		const userfriend  = this.friendRepository.findOne({relations: ["user1", "user2"],
		where : {id}});
		console.log((await userfriend).user1.id);
		const idRoom = await this.chatsService.addRoom("Message Priver", {userId: (await userfriend).user1.id, userName: (await userfriend).user1.username, socketId: ""});
		await this.friendRepository.update(id, {type: RelationType.Friend, idRoom: idRoom} );
		console.log(this.chatsService.getRooms());
		return this.friendRepository.findOne({where: {id}});
	}

	async viewFriend(id: number) : Promise<Friend[]> {
		return this.friendRepository.find({
			relations: ["user1", "user2"],
			where: [
				{ user1: { id }, type: RelationType.Friend },
				{ user2: { id }, type: RelationType.Friend },
			],
		});
	}

	async update(id: number, updateFriendDto: UpdateFriendDto): Promise<any> {
		await this.friendRepository.update(id, updateFriendDto);
		return this.friendRepository.findOne({where: {id}});
	}

	async delete(id: number): Promise<void> {
		await this.friendRepository.delete(id);
	}

	async viewinvite(id: number, idUserTarget: number) : Promise<Friend> {
		return this.friendRepository.findOne({
			relations: ["user1", "user2"],
			where: [
				{ user1: { id : idUserTarget }, user2: {id}, type: RelationType.Invited },
				{ user1: { id } ,user2: { id :idUserTarget }, type: RelationType.Invited },
			],
		});
	}

	async viewfriends(id: number, idUserTarget: number) : Promise<Friend> {
		return this.friendRepository.findOne({
			relations: ["user1", "user2"],
			where: [
				{ user1: { id :idUserTarget }, user2: {id}, type: RelationType.Friend },
				{ user1: { id } ,user2: { id :idUserTarget }, type: RelationType.Friend },
			],
		});
	}

	async viewblock(id: number, idUserTarget: number) : Promise<Friend> {
		return this.friendRepository.findOne({
			relations: ["user1", "user2"],
			where: [
				{ user1: { id :idUserTarget }, user2: {id}, type: RelationType.Blocked },
				{ user1: { id } ,user2: { id :idUserTarget }, type: RelationType.Blocked },
			],
		});
	}

	async view(id1: number, id2: number): Promise<Friend> {
		return this.friendRepository.findOne({
			relations: ["user1", "user2"],
			where: [
				{ user1: { id: id1 }, user2: { id: id2 } },
				{ user2: { id: id1 }, user1: { id: id2 } },
			],
		});
	}

}
