import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>
	) { }

	async create(createGameDto: GameDto): Promise<Game> {
		const newgame = this.gameRepository.create(createGameDto);
		return this.gameRepository.save(newgame);
	}

	async findByPlayerId(playerId: number): Promise<Game[]> {
		return this.gameRepository.find({
			where: [
				{ user1Id: playerId },
				{ user2Id: playerId },
			],
		});
	}
}
