import { IsNotEmpty, IsInt, IsNumber, IsString } from 'class-validator';

export class GameDto {
	@IsNotEmpty()
	@IsInt()
	user1Id: number;

	@IsNotEmpty()
	@IsInt()
	user2Id: number;

	@IsNotEmpty()
	@IsString()
	user1Name: string;

	@IsNotEmpty()
	@IsString()
	user2Name: string;

	@IsNotEmpty()
	@IsNumber()
	score1: number;

	@IsNotEmpty()
	@IsNumber()
	score2: number;
}
