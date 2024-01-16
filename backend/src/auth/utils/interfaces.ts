export interface UserDetails {
	username: string;
	email: string;
	avatarDefault: string;
	avatarPath?: string;
}

export interface TokenPayload {
	userId: number;
	isSecondFactorAuthenticated: boolean;
}
