import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { UsersService } from 'users/users.service';
import { User } from 'users/entities/user.entity';
import { ChatsService } from 'chats/chats.service';
import { Type } from 'class-transformer';
import { Room } from 'chats/entities/chat.entity';

@Module({
	imports:[TypeOrmModule.forFeature([Friend]),
	TypeOrmModule.forFeature([User]),
	TypeOrmModule.forFeature([Room])],
	controllers: [FriendsController],
	providers: [FriendsService, UsersService, ChatsService],
})
export class FriendsModule {}
