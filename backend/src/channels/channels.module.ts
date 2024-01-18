import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel-member.entity';
import { ChatsService } from 'chats/chats.service';
import { ChannelsGateway } from 'channels/channels.gateway';
import { Room } from 'chats/entities/chat.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Room])],
	controllers: [],
	providers: [ChatsService, ChannelsGateway],
})

export class ChannelsModule { }
