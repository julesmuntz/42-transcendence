import { Injectable, Scope } from '@nestjs/common';
import { Room, UserRoom } from '../shared/chats.interface';
import * as fs from 'fs';

export class ChatsService {
  private rooms: Room[] = [];
  private readonly dataFilePath = 'rooms-data.json';

  constructor() {
	console.log("ChatsService");
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
    let idRoom = this.rooms.length;
	if (idRoom)
		idRoom = parseInt(this.rooms[idRoom - 1].idRoom) + 1;
	const idRoomString = idRoom.toString();
    this.rooms.push({ idRoom : idRoomString, name: roomName, host, users: [] });
    await this.saveRoomsToDisk(); // Save the updated state to the file.
    return idRoom.toString();
  }

  async removeRoom(idRoom: string): Promise<void> {
	await this.loadRoomsFromDisk();
    const findRoom = await this.getRoomById(idRoom);
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.idRoom !== idRoom);
      this.saveRoomsToDisk(); // Save the updated state to the file.
    }
  }

  async getRoomById(idRoom: string): Promise<number> {
	await this.loadRoomsFromDisk();
	const roomIndex = this.rooms.findIndex((room) => room?.idRoom === idRoom);
	// console.log("roomIndex", roomIndex);
    return roomIndex;
  }

  async getRoomHost(idRoom: string): Promise<UserRoom> {
	await this.loadRoomsFromDisk();
    const findRoom = await this.getRoomById(idRoom);
    if (findRoom !== -1) {
      return this.rooms[findRoom].host;
    }
  }

  async addUserToRoom(user: UserRoom, idRoom?: string, roomName?: string): Promise<void> {
	await this.loadRoomsFromDisk();
    if (idRoom !== undefined) {
		console.log("addUserToRoom", idRoom);
      const findRoom = await this.getRoomById(idRoom);
	  console.log("findRoom", findRoom);
      if (findRoom !== -1) {
        this.rooms[findRoom].users.push(user);
		console.log("this.rooms[findRoom].users", this.rooms[findRoom].users);
		await this.saveRoomsToDisk();
        const host = await this.getRoomHost(idRoom);
        if (host.userId === user.userId) {
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
      await this.removeUserFromRoom(socketId, room.idRoom)
    }
  }

  async removeUserFromRoom(socketId: string, idRoom: string): Promise<void> {
	await this.loadRoomsFromDisk();
    const roomIndex = await this.getRoomById(idRoom);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users = this.rooms[roomIndex].users.filter((user) => user.socketId !== socketId);
    //   if (this.rooms[roomIndex].users.length === 0) {
    //     await this.removeRoom(idRoom);
    //   }
     await this.saveRoomsToDisk(); // Save the updated state to the file.
    }
  }

  async getRooms(): Promise<Room[]> {
	await this.loadRoomsFromDisk();
    return this.rooms;
  }
}
