import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend } from './entities/friend.entity';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Post()
	async create(@Body() createFriendDto: CreateFriendDto): Promise<Friend> {
		return this.friendsService.create(createFriendDto);
	}

	@Get()
	async findAll() : Promise<Friend[]> {
		return this.friendsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) : Promise<Friend> {
		const friend = await this.friendsService.findOne(id);
		if (!friend) {
			throw new NotFoundException("Friend does not exit !");
		} else {
			return friend;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateFriendDto: UpdateFriendDto) : Promise<any> {
		return this.friendsService.update(id, updateFriendDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const friend = await this.friendsService.findOne(id);
		if (!friend) {
			throw new NotFoundException("Friend does not exist !");
		} else {
			return this.friendsService.delete(id);
		}
	}
}
