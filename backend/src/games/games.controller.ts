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

	@Get('nb-wins/:id')
	async getNbWins(@Param('id') id: number): Promise<number> {
		let nbWins = 0;

		const gamesHad = await this.gamesService.findByPlayerId(id);
		nbWins = gamesHad.reduce((accumulator, current) => {
			let win = 0;
			if (current.user1.id === id)
			{
				if (current.score1 > current.score2)
					win = 1;
			}
			else if (current.user2.id === id)
			{
				if (current.score2 > current.score1)
					win = 1;
			}
			return (accumulator + win);
		}, 0);
		// console.log(nbWins);
		return (nbWins);
	}

	@Get('nb-losses/:id')
	async getNbLost(@Param('id') id: number): Promise<number> {
		console.log(id);
		const gamesHad = await this.gamesService.findByPlayerId(id);
		const nbLosses = gamesHad.reduce((accumulator, current) => {
			console.log(current.user1);
			let loss = 0;
			if (current.user1.id === id)
			{
				if (current.score1 < current.score2)
					loss = 1;
			}
			else if (current.user2.id === id)
			{
				console.log(current.user2);
				if (current.score2 < current.score1)
					loss = 1;
			}
			return (accumulator + loss);
		}, 0);
		return (nbLosses);
	}
}
