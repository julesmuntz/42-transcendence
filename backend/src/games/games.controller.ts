import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Controller('games')
export class GamesController {
	constructor(private readonly gamesService: GamesService) { }

	@Post()
	async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
		return this.gamesService.create(createGameDto);
	}

	@Get()
	async findAll(): Promise<Game[]> {
		return this.gamesService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Game> {
		const game = await this.gamesService.findOne(id);
		if (!game) {
			throw new NotFoundException("Game does not exist !");
		} else {
			return game;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto): Promise<any> {
		return this.gamesService.update(id, updateGameDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const game = await this.gamesService.findOne(id);
		if (!game) {
			throw new NotFoundException("Game does not exist !");
		} else {
			return this.gamesService.delete(id);
		}
	}
}
