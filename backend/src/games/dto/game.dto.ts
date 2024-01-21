import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class GameDto {
	@IsNotEmpty()
	@IsInt()
	user1Id: number;

	@IsNotEmpty()
	@IsInt()
	user2Id: number;

	@IsNotEmpty()
	@IsNumber()
	score1: number;

	@IsNotEmpty()
	@IsNumber()
	score2: number;
}
