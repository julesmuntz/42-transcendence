export interface UserDetails {
	username: string;
	email: string;
	avatarDefault: string;
}

export interface TokenPayload {
	userId: number;
	isSecondFactorAuthenticated: boolean;
}
