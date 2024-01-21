import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from '../games/games.service';
import { Game } from '../games/entities/game.entity';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
	imports: [TypeOrmModule.forFeature([Game])],
	providers: [
		GamesService,
		PongGateway,
		PongService,
	],
})
export class PongModule {}
