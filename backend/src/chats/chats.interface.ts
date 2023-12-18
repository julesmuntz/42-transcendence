export interface UserRoom {
	userId: number
	userName: string
  	socketId: string
}

export interface Room {
	name: string
	host: UserRoom
	users: UserRoom[]
}

export interface Message {
	user: UserRoom
  	timeSent: string
  	message: string
  	roomName: string
}


export interface ServerToClientEvents {
	chat: (e: Message) => void
}

export interface ClientToServerEvents {
	chat: (e: Message) => void
	join_room: (e: { user: UserRoom; roomName: string }) => void
}