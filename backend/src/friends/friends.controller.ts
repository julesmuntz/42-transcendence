import { Controller, Get, Req, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, RelationType } from './entities/friend.entity';
import { UsersService } from 'users/users.service';
import { Public } from 'auth/decorator/public.decorator';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService,
		private readonly userService: UsersService) {}

	// @Post()
	// async create(@Body() createFriendDto: CreateFriendDto): Promise<Friend> {
	// 	return this.friendsService.create(createFriendDto);
	// }
	@Public()
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

	@Get('invite/:id')
	async add_invite(@Param('id') user2_id: number, @Req() req: any) : Promise<void> {
		const friends = new Friend();
		friends.user1 = await this.userService.findOne(req.user.sub);
		friends.user2 = await this.userService.findOne(user2_id);
		friends.type =  RelationType.Invited;
		this.friendsService.create(friends);
	}

	// @Get('invite')
	// async view_invite(@Req() req : any) : Promise<Friend[]> {
	// 	const friend = await this.friendsService.findInvite(req.user.sub);
	// 	if (!friend) {
	// 		throw new NotFoundException("Friend does not exit !");
	// 	} else {
	// 		return friend;
	// 	}
	// }
}
