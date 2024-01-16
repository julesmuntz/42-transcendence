import { Module } from '@nestjs/common';
import { ChannelsService } from './Service/channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberService } from './Service/channel-member.service';
import { ChatsService } from 'chats/chats.service';
import { UsersService } from 'users/users.service';
import { User } from 'users/entities/user.entity';
import { ChannelsGateway } from 'channels/channels.gateway';
import { Room } from 'chats/entities/chat.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel, ChannelMember]),
	TypeOrmModule.forFeature([User]),
	TypeOrmModule.forFeature([Room])],
	controllers: [],
	providers: [ChannelsService, ChannelMemberService, ChatsService, UsersService, ChannelsGateway],
})
export class ChannelsModule { }
