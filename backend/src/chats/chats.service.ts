import { Room } from './entities/chat.entity';
import { UserRoom, Message } from 'shared/chats.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ChatsService {

	constructor(
		@InjectRepository(Room)
		private roomsRepository: Repository<Room>
	) { }

	async addRoom(roomName: string, host: UserRoom, channel: boolean): Promise<string> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom) {
			return findRoom.name; // Room already exists
		}

		const newRoom = this.roomsRepository.create({ name: roomName, host, users: [], message: [], channel });
		await this.roomsRepository.save(newRoom);
		return newRoom.name;
	}

	async removeRoom(roomName: string): Promise<void> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom) {
			await this.roomsRepository.delete(findRoom.id);
		}
	}

	async getRoomByName(roomName: string): Promise<Room | undefined> {
		return this.roomsRepository.findOne({ where: { name: roomName } });
	}

	async getRoomHost(roomName: string): Promise<UserRoom | undefined> {
		const findRoom = await this.getRoomByName(roomName);
		return findRoom?.host;
	}

	async addUserToRoom(users: UserRoom, roomName?: string): Promise<void> {
		if (roomName) {
			const findRoom = await this.getRoomByName(roomName);
			if (findRoom) {
				const room = await this.roomsRepository.findOneOrFail({ where: { id: findRoom.id } });
				if (!room.users.find(user => user.userId === users.userId)) {
					room.users.push(users);
					await this.roomsRepository.save(room);

					if (room.host.userId === users.userId) {
						room.host.userName = users.userName;
						room.host.socketId = users.socketId;
						await this.roomsRepository.save(room);
					}
				}
			}
		}
	}

	async findRoomsByUserSocketId(): Promise<Room[]> {
		return this.roomsRepository.find();
	}


	async removeUserFromAllRooms(socketId: string): Promise<void> {
		const rooms = await this.findRoomsByUserSocketId();
		for (const room of rooms) {
			await this.removeUserFromRoom(socketId, room.name);
		}
	}

	async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
		const room = await this.getRoomByName(roomName);
		if (room) {
			room.users = room.users.filter(user => user.socketId === socketId);
			await this.roomsRepository.update(room.id, room);
		}
	}

	async addMessageToRoom(payload: Message): Promise<void> {
		const room = await this.getRoomByName(payload.roomName);
		if (room) {
			room.message.push(payload);
			await this.roomsRepository.save(room);
		}
	}

	async getMessagesByRoom(roomName: string): Promise<Message[]> {
		const room = await this.getRoomByName(roomName);
		return room?.message || [];
	}

	async getRooms(): Promise<Room[]> {
		return this.roomsRepository.find();
	}

	async getUsersByRoom(roomName: string): Promise<UserRoom[]> {
		const room = await this.getRoomByName(roomName);
		return room?.users || [];
	}
}
