import React, { useEffect, useRef, useState } from 'react'
import { UserRoom, Room, Message } from "../../shared/chats.interface"
import { Socket } from 'socket.io-client';
import "./Chat.css"

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
						<span className="ml-1 text-white">{users.length}</span></button>
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
export const UserList = ({ user, hostId }: { user: UserRoom[], hostId: number }) => {
	return (
		<div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
			{user.map((users, index) => {
				return (
					<div key={index} className="mb-4 flex rounded px-4 py-2">
						<p className="text-black">{users.userName} {hostId === users.userId && <span className="ml-2">{'👑'}</span>}</p>
					</div>
				);
			})}
		</div>
	);
};
