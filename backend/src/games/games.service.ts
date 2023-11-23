import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private gameRepository : Repository<Game>
	) {}

	async create(createGameDto: CreateGameDto) : Promise<Game> {
		const newgame = this.gameRepository.create(createGameDto);
		return this.gameRepository.save(newgame);
	}

	async findAll() : Promise<Game[]> {
		return this.gameRepository.find();
	}

	async findOne(id: number) : Promise<Game> {
		return this.gameRepository.findOne({where: {id}});
	}

	async update(id: number, updateGameDto: UpdateGameDto) : Promise<Game> {
		await this.gameRepository.update(id, updateGameDto);
		return this.gameRepository.findOne({where: {id}});
	}

	async delete(id: number) : Promise<void> {
		await this.gameRepository.delete(id);
	}
}
