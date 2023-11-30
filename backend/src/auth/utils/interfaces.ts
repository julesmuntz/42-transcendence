import { Request } from "express";
import { User } from "../../users/entities/user.entity";

export interface UserDetails {
	username: string;
	email: string;
	avatarPath: string;
}

export interface RequestWithUser extends Request {
	user: User;
}

export interface TokenPayload {
	userId: number;
	isSecondFactorAuthenticated: boolean;
}