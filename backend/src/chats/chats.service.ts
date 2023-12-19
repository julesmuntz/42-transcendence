import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { Room, UserRoom } from '../../../shared/chats.interface';

@Injectable()
export class ChatsService {
	private rooms: Room[] = [];

	async addRoom(roomName: string, host: UserRoom): Promise<void> {
		const idRoom = this.rooms.length + 1;
		this.rooms.push({ idRoom, name: roomName, host, users: [] });
	}

	async removeRoom(idRoom: number): Promise<void> {
		const findRoom = await this.getRoomById(idRoom);
		if (findRoom != -1) {
			this.rooms = this.rooms.filter((room) => room.idRoom !== idRoom);
		}
	}

	async getRoomById(idRoom: number): Promise<number> {
		return this.rooms.findIndex((room) => room.idRoom === idRoom);
	}

	async getRoomHost(idRoom: number): Promise<UserRoom> {
		const findRoom = await this.getRoomById(idRoom);
		if (findRoom != -1) {
			return this.rooms[findRoom].host;
		}
	}

	async addUserToRoom(user: UserRoom, idRoom?: number, roomName?: string): Promise<void> {
		if (idRoom == undefined) {
			const findRoom = await this.getRoomById(idRoom);
			if (findRoom != -1) {
				this.rooms[findRoom].users.push(user);
				const host = await this.getRoomHost(idRoom);
				if (host.userId == user.userId) {
					this.rooms[findRoom].host.socketId = user.socketId;
				}
			}
		}
		else /*if(roomName != undefined)*/
		{
			await this.addRoom("temporaire", user);
		}
	}

	async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
		const filteredRooms = this.rooms.filter((room) => {
			const found = room.users.find((user) => user.socketId === socketId);
				if (found) {
					return found;
				}
			})
		return filteredRooms;
	}

	async removeUserFromAllRooms(socketId: string): Promise<void> {
		const rooms = await this.findRoomsByUserSocketId(socketId);
		for (const room of rooms) {
		  await this.removeUserFromRoom(socketId, room.idRoom);
		}
	}

	async removeUserFromRoom(socketId: string, idRoom: number): Promise<void> {
		const room = await this.getRoomById(idRoom)
		this.rooms[room].users = this.rooms[room].users.filter((user) => user.socketId !== socketId)
		if (this.rooms[room].users.length === 0) {
			await this.removeRoom(idRoom)
		}
	}

	async getRooms(): Promise<Room[]> {
		return this.rooms
	}

	// constructor(
	// 	@InjectRepository(Chat)
	// 	private chatRepository: Repository<Chat>
	// ) {}

	// async create(createChatDto: CreateChatDto) : Promise<Chat> {
	// 	const newchat = this.chatRepository.create(createChatDto);
	// 	return this.chatRepository.save(newchat);
	// }

	// async findAll() : Promise<Chat[]> {
	// 	return this.chatRepository.find();
	// }

	// async findOne(id: number) : Promise<Chat> {
	// 	return this.chatRepository.findOne({where: {id}});
	// }

	// async update(id: number, updateChatDto: UpdateChatDto) : Promise<Chat> {
	// 	await this.chatRepository.update(id, updateChatDto);
	// 	return this.chatRepository.findOne({where: {id}});
	// }

	// async delete(id: number) : Promise<void> {
	// 	await this.chatRepository.delete(id);
	// }
}
