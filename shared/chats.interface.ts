export interface UserRoom {
	userId: number
	userName: string
	socketId: string
	muted?: boolean // true = muted, false = not muted
	type?: string // admin, mod, user
	ban?: boolean // true = banned, false = not banned
	avatarPath: string
}

//
export interface Message {
	user: UserRoom
	timeSent: string
	message: string
	roomName: string
}

export enum ChannelType {
	Public = 'public',
	Protected = 'protected',
	Private = 'private',
}

export interface Room {
	name: string
	host: UserRoom
	users: UserRoom[]
	message: Message[]
	channel: boolean // true = channel room, false = chat room
	type: ChannelType
}


export interface userInfo {
	id: number;
	username: string;
	avatarPath: string;
	status: string;
	socketId: string;
}
