import { Request } from "express";
import { User } from "../../users/entities/user.entity";

export interface UserDetails {
	id: number;
	username: string;
	avatarPath: string;
	oauth42Token: string;
	email: string;
	displayName: string;
}

export interface RequestWithUser extends Request {
	user: User;
}

export interface TokenPayload {
	userId: number;
	isSecondFactorAuthenticated: boolean;
}