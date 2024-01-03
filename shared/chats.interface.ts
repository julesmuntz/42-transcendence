export interface UserRoom {
	userId: number
	userName: string
	socketId: string
	// muted: boolean // true = muted, false = not muted
	// type: string // admin, mod, user
}

export interface Room {
	idRoom: string
	name: string
	host: UserRoom
	users: UserRoom[]
	message: Message[]
	// channel: boolean // true = channel room, false = chat room
}

export interface Message {
	user: UserRoom
	timeSent: string
	message: string
	roomName: string
	idRoom: string
}


export interface ServerToClientEvents {
	chat: (e: Message) => void
}

export interface ClientToServerEvents {
	chat: (e: Message) => void
	join_room: (e: { user: UserRoom; idRoom: string}) => void
}


// friends


export interface ServerToClientEventsFriends {
	action_reload: (e: void) => void
}

export interface ClientToServerEventsFriends {
	action_reload: (e: void) => void
}