export interface UserRoom {
	userId: number
	userName: string
	socketId: string
	// muted: boolean // true = muted, false = not muted
	// type: string // admin, mod, user
}

export interface Room {
	name: string
	host: UserRoom
	users: UserRoom[]
	message: Message[]
	// channel: boolean // true = channel room, false = chat room
}

export interface Message {
	// id?: number
	user: UserRoom
	timeSent: string
	message: string
	roomName: string
}
