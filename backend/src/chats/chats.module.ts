import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Room])],
	controllers: [ChatsController],
	providers: [ChatsService, ChatGateway],
})
export class ChatsModule { }
