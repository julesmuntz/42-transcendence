import { Module } from '@nestjs/common';
import { ChannelsService } from './Service/channels.service';
import { ChannelsController } from './Controller/channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { MessageChannel } from './entities/message-channel.entity';
import { ChannelMember } from './entities/channel-menber.entity';
import { ChannelMemberController } from './Controller/channel-member.controller';
import { ChannelMemberService } from './Service/channel-member.service';
import { MessageChannelService } from './Service/message-channel.service';
import { MessageChannelController } from './Controller/message-channel.controller';
import { ChatsService } from 'chats/chats.service';
import { UsersService } from 'users/users.service';
import { User } from 'users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel, ChannelMember, MessageChannel]),
	TypeOrmModule.forFeature([User])],
	controllers: [ChannelsController, ChannelMemberController, MessageChannelController],
	providers: [ChannelsService, ChannelMemberService, MessageChannelService, ChatsService, UsersService],
})
export class ChannelsModule {}
