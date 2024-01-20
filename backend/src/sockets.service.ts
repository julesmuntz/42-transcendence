import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

export enum NotificationType {
	Info,
	Success,
	Warning,
	Error,
}

type Connection = {
	userId: string;
	date: Date;
};

@Injectable()
export class SocketsService {
	public socketUsers = new Map<Socket, Connection>();

	addSocket(userId: string, socket: Socket) {
		this.socketUsers.set(socket, { userId, date: new Date() });
	}

	removeSocket(socket: Socket): { userId: string; minutesSpent: number } | undefined {
		if (!this.socketUsers.has(socket))
			return undefined;
		const connection: Connection = this.socketUsers.get(socket);
		this.socketUsers.delete(socket);
		return ({
			userId: connection.userId,
			minutesSpent:
				(new Date().getTime() - connection.date.getTime()) / 60000,
		});
	}

	getUserId(socket: Socket): string | undefined {
		return this.socketUsers?.get(socket).userId;
	}
}
