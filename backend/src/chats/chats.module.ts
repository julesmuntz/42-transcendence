import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';

import { ChannelMember } from 'channels/entities/channel-member.entity';
import { Channel } from 'channels/entities/channel.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Room]),
	TypeOrmModule.forFeature([ChannelMember]),
	TypeOrmModule.forFeature([Channel])],
	controllers: [ChatsController],
	providers: [ChatsService, ChatGateway],
})
export class ChatsModule { }
