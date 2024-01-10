import { Room } from './entities/chat.entity';
import { UserRoom, Message } from '../shared/chats.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


export class ChatsService {

	constructor(
		@InjectRepository(Room)
		private roomsRepository: Repository<Room>
	) {}

	async addRoom(roomName: string, host: UserRoom, channel: boolean): Promise<string> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom !== -1) {
			return;
		}
		this.roomsRepository.create({ name: roomName, host, users: [], message: [], channel });
		this.roomsRepository.save({ name: roomName, host, users: [], message: [], channel });
		return roomName.toString();
	}

	async removeRoom(roomName: string): Promise<void> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom !== -1) {
			this.roomsRepository.delete({ name: roomName });
		}
	}

	async getRoomByName(roomName: string): Promise<number> {
		const room = await this.roomsRepository.findOne({ where: { name: roomName } });
		if (room) {
			return room.id;
		}
		return -1;
	}

	async getRoomHost(roomName: string): Promise<UserRoom> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom !== -1) {
			return (await this.roomsRepository.findOne({ where: { id: findRoom } })).host;
		}
	}

	async addUserToRoom(users: UserRoom, roomName?: string): Promise<void> {
		if (roomName !== undefined) {
			const findRoom = await this.getRoomByName(roomName);
			if (findRoom !== -1) {
				if ((await (this.roomsRepository.findOne({ where: { id: findRoom } }))).users.find((user) => user.userId === users.userId))
					return;
					this.roomsRepository.update({ name: roomName }, { users: [...(await this.roomsRepository.findOne({ where: { id: findRoom } })).users, users] });

				let host = await this.getRoomHost(roomName);
				if (host.userId === users.userId) {
					host.userName = users.userName;
					host.socketId = users.socketId;
					this.roomsRepository.update({ name: roomName }, { host: host });
				}
			}
		}
	}

	async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
		const filteredRooms = await this.roomsRepository.find();
		const result = filteredRooms.filter((room) => {
			const found = room.users.find((user) => user.socketId === socketId);
			return found ? true : false;
		});
		return result;
	}

	async removeUserFromAllRooms(socketId: string): Promise<void> {
		const rooms = await this.findRoomsByUserSocketId(socketId)
		for (const room of rooms) {
			await this.removeUserFromRoom(socketId, room.name)
		}
	}

	async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
		const roomIndex = await this.getRoomByName(roomName);
		if (roomIndex !== -1) {

			// this.rooms[roomIndex].users = this.rooms[roomIndex].users.filter((user) => user.socketId !== socketId);
			//   if (this.rooms[roomIndex].users.length === 0) {
			//     await this.removeRoom(roomName);
			//   }
		}
	}

	async addMessageToRoom(payload: Message): Promise<void> {
		const roomIndex = await this.getRoomByName(payload.roomName);
		if (roomIndex !== -1) {
			this.roomsRepository.update({ name: payload.roomName }, { message: [...(await this.roomsRepository.findOne({ where: { id: roomIndex } })).message, payload] });
		}
	}

	async getMessagesByRoom(roomName: string): Promise<Message[]> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom !== -1) {
			return (await this.roomsRepository.findOne({ where: { id: findRoom } })).message;
		}
	}

	async getRooms(): Promise<Room[]> {
		return this.roomsRepository.find();
	}

	async getUsersByRoom(roomName: string): Promise<UserRoom[]> {
		const findRoom = await this.getRoomByName(roomName);
		if (findRoom !== -1) {
			return (await this.roomsRepository.findOne({ where: { id: findRoom } })).users;
		}
	}
}


// export class ChatsService {
// 	private rooms: Room[] = [];
// 	private readonly dataFilePath = 'rooms-data.json';

// 	constructor() {
// 		this.loadRoomsFromDisk();
// 	}

// 	private loadRoomsFromDisk(): void {
// 		try {
// 			const data = fs.readFileSync(this.dataFilePath, 'utf-8');
// 			this.rooms = JSON.parse(data);
// 		} catch (error) {
// 			// Handle file reading errors or initialize the rooms array if the file doesn't exist.
// 			this.rooms = [];
// 		}
// 	}

// 	private saveRoomsToDisk(): void {
// 		const data = JSON.stringify(this.rooms, null, 2);
// 		fs.writeFileSync(this.dataFilePath, data, 'utf-8');
// 	}

// 	async addRoom(roomName: string, host: UserRoom, channel: boolean): Promise<string> {
// 		await this.loadRoomsFromDisk();
// 		const findRoom = await this.getRoomById(roomName);
// 		if (findRoom !== -1) {
// 			return;
// 		}
// 		this.rooms.push({ name: roomName, host, users: [], message: [], channel });
// 		await this.saveRoomsToDisk(); // Save the updated state to the file.
// 		return roomName.toString();
// 	}

// 	async removeRoom(roomName: string): Promise<void> {
// 		await this.loadRoomsFromDisk();
// 		const findRoom = await this.getRoomById(roomName);
// 		if (findRoom !== -1) {
// 			this.rooms = this.rooms.filter((room) => room.name !== roomName);
// 			this.saveRoomsToDisk(); // Save the updated state to the file.
// 		}
// 	}

// 	async getRoomById(roomName: string): Promise<number> {
// 		await this.loadRoomsFromDisk();
// 		const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
// 		return roomIndex;
// 	}

// 	async getRoomByName(roomName: string): Promise<number> {
// 		await this.loadRoomsFromDisk();
// 		const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
// 		return roomIndex;
// 	}

// 	async getRoomHost(roomName: string): Promise<UserRoom> {
// 		await this.loadRoomsFromDisk();
// 		const findRoom = await this.getRoomById(roomName);
// 		if (findRoom !== -1) {
// 			return this.rooms[findRoom].host;
// 		}
// 	}

// 	async addUserToRoom(users: UserRoom, roomName?: string): Promise<void> {
// 		await this.loadRoomsFromDisk();
// 		if (roomName !== undefined) {
// 			const findRoom = await this.getRoomById(roomName);
// 			if (findRoom !== -1) {
// 				if (this.rooms[findRoom].users.find((user) => user.userId === users.userId))
// 					return;
// 				this.rooms[findRoom].users.push(users);
// 				console.log("this.rooms[findRoom].users", this.rooms[findRoom].users);
// 				await this.saveRoomsToDisk();
// 				const host = await this.getRoomHost(roomName);
// 				if (host.userId === users.userId) {
// 					this.rooms[findRoom].host.userName = users.userName;
// 					this.rooms[findRoom].host.socketId = users.socketId;
// 				}
// 				await this.saveRoomsToDisk();
// 			}
// 		}
// 	}

// 	async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
// 		const filteredRooms = this.rooms.filter((room) => {
// 			const found = room.users.find((user) => user.socketId === socketId)
// 			if (found) {
// 				return found
// 			}
// 		})
// 		return filteredRooms
// 	}

// 	async removeUserFromAllRooms(socketId: string): Promise<void> {
// 		const rooms = await this.findRoomsByUserSocketId(socketId)
// 		for (const room of rooms) {
// 			await this.removeUserFromRoom(socketId, room.name)
// 		}
// 	}

// 	async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
// 		await this.loadRoomsFromDisk();
// 		const roomIndex = await this.getRoomById(roomName);
// 		if (roomIndex !== -1) {
// 			this.rooms[roomIndex].users = this.rooms[roomIndex].users.filter((user) => user.socketId !== socketId);
// 			//   if (this.rooms[roomIndex].users.length === 0) {
// 			//     await this.removeRoom(roomName);
// 			//   }
// 			await this.saveRoomsToDisk(); // Save the updated state to the file.
// 		}
// 	}

// 	async addMessageToRoom(payload: Message): Promise<void> {
// 		await this.loadRoomsFromDisk();
// 		const roomIndex = await this.getRoomById(payload.roomName);
// 		if (roomIndex !== -1) {
// 			console.log("addMessageToRoom", payload);

// 			this.rooms[roomIndex].message.push({ user: payload.user, timeSent: payload.timeSent, message: payload.message, roomName: payload.roomName });
// 			await this.saveRoomsToDisk(); // Save the updated state to the file.
// 		}
// 	}

// 	async getMessagesByRoom(roomName: string): Promise<Message[]> {
// 		await this.loadRoomsFromDisk();
// 		const findRoom = await this.getRoomById(roomName);
// 		console.log("getMessagesByRoom ", findRoom);
// 		if (findRoom !== -1) {
// 			return this.rooms[findRoom].message;
// 		}
// 	}

// 	async getRooms(): Promise<Room[]> {
// 		await this.loadRoomsFromDisk();
// 		return this.rooms;
// 	}

// 	async getUsersByRoom(roomName: string): Promise<UserRoom[]> {
// 		await this.loadRoomsFromDisk();
// 		const findRoom = await this.getRoomById(roomName);
// 		if (findRoom !== -1) {
// 			return this.rooms[findRoom].users;
// 		}
// 	}
// }
