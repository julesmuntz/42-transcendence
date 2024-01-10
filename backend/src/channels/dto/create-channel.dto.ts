import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

export class CreateChannelDto {

	@IsNotEmpty({ message: 'Name should not be empty' })
	@IsString({ message: 'Name should be a string' })
	name: string;

	@IsNotEmpty({ message: 'Type should not be empty' })
	@IsString({ message: 'Type should be a string' })
	type: ChannelType;

	@IsOptional()
	@IsString({ message: 'Password hash should be a string' })
	passwordHash: string;

}
