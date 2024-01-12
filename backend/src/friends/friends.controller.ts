import { Controller, Get, Req, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, RelationType } from './entities/friend.entity';
import { UsersService } from 'users/users.service';
import { Public } from 'auth/decorator/public.decorator';
import { User } from 'users/entities/user.entity';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { ChatsService } from 'chats/chats.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService,
		private readonly userService: UsersService,
		private readonly chatService: ChatsService) { }


	@Post()
	async add_invite(@Body() body: { createFriendDto: any }, @Req() req: any): Promise<Friend> {
		if (body.createFriendDto.user2.id == req.user.sub)
			throw new NotFoundException("Error create Friends");
		return this.friendsService.create(body.createFriendDto);
	}

	//a laire ok
	@Get('view_invite')
	async view_invite(@Req() req: any): Promise<Friend[]> {
		return this.friendsService.findInvite(req.user.sub);
	}

	//a l'aire ok
	@Get('view_friend')
	async view_friend(@Req() req: any): Promise<Friend[]> {
		return this.friendsService.viewFriend(req.user.sub);
	}

	// Friends scearch
	@Get('viewinvite/:id')
	async viewinvite(@Param('id') id: number, @Req() req: any): Promise<Friend | null> {
		const viewinvite = await this.friendsService.viewinvite(req.user.sub, id);
		if (viewinvite)
			return this.friendsService.viewinvite(req.user.sub, id);
		else
			return null;
	}

	@Get('viewfriends/:id')
	async viewfriends(@Param('id') id: number, @Req() req: any): Promise<Friend | null> {
		return this.friendsService.viewfriends(req.user.sub, id);
	}

	@Get('viewblock/:id')
	async viewblock(@Param('id') id: number, @Req() req: any): Promise<Friend | null> {
		return this.friendsService.viewblock(req.user.sub, id);
	}
	// fin
	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Friend> {
		const friend = await this.friendsService.findOne(id);
		if (!friend) {
			throw new NotFoundException("Friend does not exit !");
		} else {
			return friend;
		}
	}

	//modification a aporter

	//les modification verifier en premier si il sont amie ou non delete si besoin est apres create en function.
	@Patch('bloquet/:id')
	async bloquet(@Param('id') id: number, @Req() req: any): Promise<Friend> {

		const verifFriend = await this.friendsService.view(req.user.sub, id);
		const verifblock = await this.friendsService.viewblock(req.user.sub, id);
		const bloqueFriend = new CreateFriendDto();
		bloqueFriend.user1 = await this.userService.findOne(req.user.sub);
		bloqueFriend.user2 = await this.userService.findOne(id);
		bloqueFriend.type = RelationType.Blocked;
		if ((req.user.sub != id && (!verifblock || verifblock.user2.id != req.user.sub))) {
			console.log("bloquet");
			if (!verifFriend) {
				return this.friendsService.create(bloqueFriend);
			} else {
				this.friendsService.delete(verifFriend.id);
				return this.friendsService.create(bloqueFriend);
			}
		}
		console.log("NOn ");
	}


	// A tester !!
	//check que il y a pas deja un truc en db

	//check que il exite bien
	@Patch('accept/:id')
	async acceptFriends(@Param('id') id: number): Promise<Friend> {
		const check = await this.friendsService.findOne(id);
		if (!check)
			throw new NotFoundException("Error update add Friends");
		return this.friendsService.addFriend(id);
	}
	//pas de check a effectuer
	@Delete(':id')
	async delete(@Param('id') id: number): Promise<void> {
		const friend = await this.friendsService.findOne(id);
		if (!friend) {
			throw new NotFoundException("Friend does not exist !");
		} else {
			if (friend.type == RelationType.Friend) {
				console.log(friend.roomName);
				// const roomName = await this.chatService.getRoomById(friend.roomName);
				await this.chatService.removeRoom(friend.roomName);
			}
			return this.friendsService.delete(id);
		}
	}

}
