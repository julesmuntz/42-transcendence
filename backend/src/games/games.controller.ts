import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';

@Controller('games')
export class GamesController {
	constructor(private readonly gamesService: GamesService) { }

	@Get(':id')
	async findById(@Param('id') id: number): Promise<Game[]> {
		return (this.gamesService.findByPlayerId(id));
	}
}
