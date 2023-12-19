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

  async addRoom(roomName: string, host: UserRoom): Promise<number> {
    let idRoom = this.rooms.length;
	if (idRoom)
		idRoom = this.rooms[idRoom - 1].idRoom + 1;
    this.rooms.push({ idRoom, name: roomName, host, users: [] });
    this.saveRoomsToDisk(); // Save the updated state to the file.
    return idRoom;
  }

  async removeRoom(idRoom: number): Promise<void> {
    const findRoom = await this.getRoomById(idRoom);
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.idRoom !== idRoom);
      this.saveRoomsToDisk(); // Save the updated state to the file.
    }
  }

  async getRoomById(idRoom: number): Promise<number> {
    return this.rooms.findIndex((room) => room.idRoom === idRoom);
  }

  async getRoomHost(idRoom: number): Promise<UserRoom> {
    const findRoom = await this.getRoomById(idRoom);
    if (findRoom !== -1) {
      return this.rooms[findRoom].host;
    }
  }

  async addUserToRoom(user: UserRoom, idRoom?: number, roomName?: string): Promise<void> {
    if (idRoom !== undefined) {
      const findRoom = await this.getRoomById(idRoom);
      if (findRoom !== -1) {
        this.rooms[findRoom].users.push(user);
        const host = await this.getRoomHost(idRoom);
        if (host.userId === user.userId) {
          this.rooms[findRoom].host.socketId = user.socketId;
        }
        this.saveRoomsToDisk(); // Save the updated state to the file.
      }
    } else if (roomName !== undefined) {
      await this.addRoom(roomName, user);
    }
  }

  // ... rest of the methods ...

  async removeUserFromRoom(socketId: string, idRoom: number): Promise<void> {
    const roomIndex = await this.getRoomById(idRoom);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users = this.rooms[roomIndex].users.filter((user) => user.socketId !== socketId);
      if (this.rooms[roomIndex].users.length === 0) {
        await this.removeRoom(idRoom);
      }
      this.saveRoomsToDisk(); // Save the updated state to the file.
    }
  }

  async getRooms(): Promise<Room[]> {
	this.loadRoomsFromDisk();
    return this.rooms;
  }
}
