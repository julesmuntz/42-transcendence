import { Controller, Get, Req, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, RelationType } from './entities/friend.entity';
import { UsersService } from 'users/users.service';
import { Public } from 'auth/decorator/public.decorator';
import { User } from 'users/entities/user.entity';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService,
		private readonly userService: UsersService) {}

	// @Post()
	// async create(@Body() createFriendDto: CreateFriendDto): Promise<Friend> {
	// 	return this.friendsService.create(createFriendDto);
	// }

	@Get()
	async findAll() : Promise<Friend[]> {
		return this.friendsService.findAll();
	}

	@Get('view_invite')
	async view_invite(@Req() req : any) : Promise<Friend[]> {
		return this.friendsService.findInvite(req.user.sub);
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

	@Get('add_friend/:id')
	async add_friend(@Param('id') id: number) : Promise<Friend> {
		return this.friendsService.addFriend(id);
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

	//A passer en Post !!
	@Get('invite/:id')
	async add_invite(@Param('id') user2_id: number, @Req() req: any) : Promise<Friend> {
		const addfriends = new CreateFriendDto();
		addfriends.user1 = await this.userService.findOne(req.user.sub);
		addfriends.user2 = await this.userService.findOne(user2_id);
		addfriends.type =  RelationType.Invited;
		const f = await this.friendsService.create(addfriends);

		return f;
	}

}
