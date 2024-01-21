import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>
	) { }

	async create(game: GameDto): Promise<void> {
		const user1 = await this.gameRepository.manager.findOne(User, { where: { id: game.user1Id } });
		const user2 = await this.gameRepository.manager.findOne(User, { where: { id: game.user2Id } });
		const gameEntity = this.gameRepository.create({ user1: user1, user2: user2, score1: game.score1, score2: game.score2 });
		this.gameRepository.save(gameEntity);
	}

	async findByPlayerId(playerId: number): Promise<Game[]> {
		return this.gameRepository.find({
			relations: {
				user1: true,
				user2: true,
			},
			where: [
				{ user1: { id: playerId } },
				{ user2: { id: playerId } },
			],
		});
	}
}
