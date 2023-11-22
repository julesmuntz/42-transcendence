import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../entities/user.entity';


export class CreateUserDto {
	@IsNotEmpty({ message: 'Name should not be empty'})
	@IsString({ message: 'Name should be a string' })
	name: string;

	@IsOptional()
	@IsNumber({}, { message: 'Elo should be a number' })
	elo: number;

	@IsOptional()
	@IsEnum(UserStatus, { message: 'Invalid status' })
	status: UserStatus;

	@IsOptional()
	@IsString({ message: 'Avatar path should be a string' })
	avatarPath: string;

	@IsOptional()
	@IsString({ message: 'OAuth 42 token should be a string' })
	oauth42Token: string;

	@IsOptional()
	@IsString({ message: 'OAuth Google token should be a string' })
	oauthGoogleToken: string;
}

