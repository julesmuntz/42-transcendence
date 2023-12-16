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

	//peut-etre a sup
	@Get()
	async findAll() : Promise<Friend[]> {
		return this.friendsService.findAll();
	}

	//a laire ok
	@Get('view_invite')
	async view_invite(@Req() req : any) : Promise<Friend[]> {
		return this.friendsService.findInvite(req.user.sub);
	}

	//a l'aire ok
	@Get('view_friend')
	async view_friend(@Req() req : any) : Promise<Friend[]> {
		return this.friendsService.viewFriend(req.user.sub);
	}

	@Get('viewinvite/:id')
	async viewinvite(@Param('id') id: number, @Req() req : any) : Promise<Friend> {
		return this.friendsService.viewinvite(req.user.sub, id);
	}

	@Get('viewblock/:id')
	async viewblock(@Param('id') id: number, @Req() req : any) : Promise<Friend> {
		return this.friendsService.viewblock(req.user.sub, id);
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

	//modifition a aporter peut-etrre
	@Get('add_friend/:id')
	async add_friend(@Param('id') id: number) : Promise<Friend> {
		return this.friendsService.addFriend(id);
	}

	//modification a aporter
	@Get('bloquet/:id')
	async bloquet(@Param('id') id: number, @Req() req: any, @Body() body: {user2: number}) : Promise<Friend> {
		const friend = await this.friendsService.view(req.user.sub, body.user2);
		const bloqueFriend = new CreateFriendDto();
		bloqueFriend.user1 = await this.userService.findOne(req.user.sub);
		bloqueFriend.user2 = await this.userService.findOne(body.user2);
		bloqueFriend.type = RelationType.Blocked;
		if (!friend) {
			return this.friendsService.create(bloqueFriend);
		} else {
			this.friendsService.delete(id);
			return this.friendsService.create(bloqueFriend);
		}
	}
	// peut-etre a supprimer
	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateFriendDto: UpdateFriendDto) : Promise<any> {
		return this.friendsService.update(id, updateFriendDto);
	}

	//pas de check a effectuer
	@Delete(':id')
	async delete(@Param('id') id: number) : Promise<void> {
		const friend = await this.friendsService.findOne(id);
		if (!friend) {
			throw new NotFoundException("Friend does not exist !");
		} else {
			return this.friendsService.delete(id);
		}
	}

	//A passer en Post !!
	//A ne pas oublier de check si il sont deja friend ou inviter ou bloquet
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
