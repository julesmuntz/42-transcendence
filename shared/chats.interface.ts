export interface UserRoom {
	userId: number
	userName: string
	socketId: string
}

export interface Room {
	idRoom: string //moi qui est rajouté
	name: string
	host: UserRoom
	users: UserRoom[]
	message: Message[]
}

export interface Message {
	user: UserRoom
	timeSent: string
	message: string
	roomName: string
	idRoom: string //moi qui est rajouté
}


export interface ServerToClientEvents {
	chat: (e: Message) => void
}

export interface ClientToServerEvents {
	chat: (e: Message) => void
	join_room: (e: { user: UserRoom; idRoom: string}) => void
}