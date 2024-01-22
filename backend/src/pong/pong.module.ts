import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from '../games/games.service';
import { Game } from '../games/entities/game.entity';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Game]),
		TypeOrmModule.forFeature([User]),
	],
	providers: [
		GamesService,
		PongGateway,
		PongService,
		UsersService,
	],
})
export class PongModule {}
