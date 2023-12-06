import { Request } from "express";
import { User } from "../../users/entities/user.entity";
import { CreateChannelDto } from "src/channels/dto/create-channel.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export interface UserDetails {
	username: string;
	email: string;
	avatarDefault: string;
}

export interface TokenPayload {
	userId: number;
	isSecondFactorAuthenticated: boolean;
}