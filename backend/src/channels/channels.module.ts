import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberService } from './Service/channel-member.service';
import { ChatsService } from 'chats/chats.service';
import { ChannelsGateway } from 'channels/channels.gateway';
import { Room } from 'chats/entities/chat.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ChannelMember]),
	TypeOrmModule.forFeature([Room])],
	controllers: [],
	providers: [ChannelMemberService, ChatsService, ChannelsGateway],
})

export class ChannelsModule { }
