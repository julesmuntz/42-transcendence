import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from 'users/entities/user.entity';

export const statusOnline: UpdateUserDto = {
	status: UserStatus.Online,
};

export const statusInGame: UpdateUserDto = {
	status: UserStatus.InGame,
};

export const statusOffline: UpdateUserDto = {
	status: UserStatus.Offline,
};

export class UpdateUserDto extends PartialType(CreateUserDto) { }
