import React, { useEffect, useRef, useState } from 'react'
import { UserRoom, Room, Message } from "../../shared/chats.interface"
import { Socket } from 'socket.io-client';
import "./Chat.css"

// const socket: Socket = io("http://paul-f4Ar7s11:3030", { autoConnect: true });

export const Header = ({
	isConnected,
	users,
	handleUsersClick,
	handleLeaveRoom,
	roomName,
}: {
	isConnected: boolean
	users: UserRoom[]
	handleUsersClick: () => void
	handleLeaveRoom: () => void
	roomName: string
}) => {
	return (
		<div className="panel-heading">
			<div className="panel-control">
				<div className="btn-group">
					<button className="btn btn-default" type="button" onClick={() => handleUsersClick()}> <span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
						<span className="ml-1 text-black">{users.length}</span></button>
					<button type="button" className="btn btn-default" data-toggle="dropdown"><i
						className="fa fa-gear"></i></button>
				</div>
			</div>
			<h3 className="panel-title">{roomName} <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span></h3>
		</div>
	)

}

//ajouter est la room est un channel mettre un bouton kick ban mute unmute unban est un bouton pour changer le nom de la room
// Import necessary dependencies if needed
export const UserList = ({ room, socket, user }: { room: Room, socket: Socket, user: Pick<UserRoom, 'userId' | 'userName'> }) => {
	return (
		<div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
			{room.users.map((users, index) => {
				return (
					<div key={index} className="mb-4 flex rounded px-4 py-2">
						<p className="text-black">{users.userName}</p>
						{room.host.userId === users.userId && <span className="ml-2">{'👑'}</span>}

						{/* Check if the user is not the host and if the room is a channel, then display a kick button */}
						{room.channel === true && room.host.userId === user.userId && room.host.userId !== users.userId && (
							<button
								className="ml-2 btn btn-default"
								type="button"
								onClick={() => {
									socket.emit('kick_room', { user: user, roomName: room.name });
								}}
							>
								<span className="mr-1 text-lg text-white">{'👢'}</span>
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
};

