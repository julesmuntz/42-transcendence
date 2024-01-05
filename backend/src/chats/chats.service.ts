import { Injectable, Scope } from '@nestjs/common';
import { Room, UserRoom, Message } from '../shared/chats.interface';
import * as fs from 'fs';

export class ChatsService {
  private rooms: Room[] = [];
  private readonly dataFilePath = 'rooms-data.json';

  constructor() {
    this.loadRoomsFromDisk();
  }

  private loadRoomsFromDisk(): void {
    try {
      const data = fs.readFileSync(this.dataFilePath, 'utf-8');
      this.rooms = JSON.parse(data);
    } catch (error) {
      // Handle file reading errors or initialize the rooms array if the file doesn't exist.
      this.rooms = [];
    }
  }

  private saveRoomsToDisk(): void {
    const data = JSON.stringify(this.rooms, null, 2);
    fs.writeFileSync(this.dataFilePath, data, 'utf-8');
  }

  async addRoom(roomName: string, host: UserRoom): Promise<string> {
	await this.loadRoomsFromDisk();
	const findRoom = await this.getRoomById(roomName);
	if (findRoom !== -1) {
		return;
	}
    this.rooms.push({ name: roomName, host, users: [], message: [] });
    await this.saveRoomsToDisk(); // Save the updated state to the file.
    return roomName.toString();
  }

  async removeRoom(roomName: string): Promise<void> {
	await this.loadRoomsFromDisk();
    const findRoom = await this.getRoomById(roomName);
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.name !== roomName);
      this.saveRoomsToDisk(); // Save the updated state to the file.
    }
  }

  async getRoomById(roomName: string): Promise<number> {
	await this.loadRoomsFromDisk();
	const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
	// console.log("roomIndex", roomIndex);
    return roomIndex;
  }

  async getRoomByName(roomName: string): Promise<number> {
	await this.loadRoomsFromDisk();
	const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
	// console.log("roomIndex", roomIndex);
	return roomIndex;
  }

  async getRoomHost(roomName: string): Promise<UserRoom> {
	await this.loadRoomsFromDisk();
    const findRoom = await this.getRoomById(roomName);
    if (findRoom !== -1) {
      return this.rooms[findRoom].host;
    }
  }

  async addUserToRoom(user: UserRoom, roomName?: string): Promise<void> {
	await this.loadRoomsFromDisk();
    if (roomName !== undefined) {
		console.log("addUserToRoom", roomName);
      const findRoom = await this.getRoomById(roomName);
	  console.log("findRoom", findRoom);
      if (findRoom !== -1) {
        this.rooms[findRoom].users.push(user);
		console.log("this.rooms[findRoom].users", this.rooms[findRoom].users);
		await this.saveRoomsToDisk();
        const host = await this.getRoomHost(roomName);
        if (host.userId === user.userId) {
			this.rooms[findRoom].host.userName = user.userName;
			this.rooms[findRoom].host.socketId = user.socketId;
        }
        await this.saveRoomsToDisk(); // Save the updated state to the file.
      }

    } else if (roomName !== undefined) {
    	await this.addRoom(roomName, user);
    }
  }

  async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
    const filteredRooms = this.rooms.filter((room) => {
      const found = room.users.find((user) => user.socketId === socketId)
      if (found) {
        return found
      }
    })
    return filteredRooms
  }

  async removeUserFromAllRooms(socketId: string): Promise<void> {
    const rooms = await this.findRoomsByUserSocketId(socketId)
    for (const room of rooms) {
      await this.removeUserFromRoom(socketId, room.name)
    }
  }

  async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
	await this.loadRoomsFromDisk();
    const roomIndex = await this.getRoomById(roomName);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users = this.rooms[roomIndex].users.filter((user) => user.socketId !== socketId);
    //   if (this.rooms[roomIndex].users.length === 0) {
    //     await this.removeRoom(roomName);
    //   }
     await this.saveRoomsToDisk(); // Save the updated state to the file.
    }
  }

  async addMessageToRoom(payload: Message): Promise<void> {
	await this.loadRoomsFromDisk();
	const roomIndex = await this.getRoomById(payload.roomName);
	if (roomIndex !== -1) {
		console.log("addMessageToRoom", payload);

	  this.rooms[roomIndex].message.push({ user: payload.user, timeSent: payload.timeSent, message: payload.message, roomName: payload.roomName });
	  await this.saveRoomsToDisk(); // Save the updated state to the file.
	}
  }

  async getMessagesByRoom(roomName: string): Promise<Message[]> {
	await this.loadRoomsFromDisk();
	const findRoom = await this.getRoomById(roomName);
	console.log("getMessagesByRoom ", findRoom);
	if (findRoom !== -1) {
	  return this.rooms[findRoom].message;
	}
  }

  async getRooms(): Promise<Room[]> {
	await this.loadRoomsFromDisk();
    return this.rooms;
  }
}
