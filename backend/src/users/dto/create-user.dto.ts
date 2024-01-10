import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../entities/user.entity';


export class CreateUserDto {

	@IsNotEmpty({ message: 'Email should not be empty' })
	@IsString({ message: 'Email token should be a string' })
	email: string;

	@IsNotEmpty({ message: 'Username should not be empty' })
	@IsString({ message: 'Username should be a string' })
	username: string;

	@IsOptional()
	@IsNumber({}, { message: 'Elo should be a number' })
	elo: number;

	@IsOptional()
	@IsEnum(UserStatus, { message: 'Invalid status' })
	status: UserStatus;

	@IsNotEmpty()
	@IsString({ message: 'Avatar path should be a string' })
	avatarDefault: string;

	@IsOptional()
	@IsString({ message: 'Avatar path should be a string' })
	avatarPath: string;

	@IsOptional()
	@IsString({ message: 'TFA secret should be a string' })
	TFASecret: string;

	@IsOptional()
	@IsString({ message: 'TFA enabled should be a string' })
	isTFAEnabled: boolean;

}

