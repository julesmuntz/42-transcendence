import React, { useState, useEffect, useContext, useTransition } from 'react'
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location'
import { io, Socket } from 'socket.io-client'
import { UserContext } from '../../contexts/UserContext'
import { ClientToServerEvents, Message, ServerToClientEvents, UserRoom} from "../../../shared/chats.interface";
import { Header } from './header';

export const ChatLayout = ({ children }: { children: React.ReactElement[] }) => {
	return (
	  <div className="mx-auto flex h-screen w-screen justify-center bg-gray-900">
		<div className="flex h-full w-full flex-col px-2 md:w-8/12 lg:w-6/12 xl:w-4/12">
		  {children}
		</div>
	  </div>
	)
  }

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({ autoConnect: false });
export default function Chat() {
	const userContext = useContext(UserContext);
	const {
		data: { user, idRoom},
	} = useMatch<ChatLocationGenerics>()

	const [isConnected, setIsConnected] = useState(socket.connected);
	const [messages, setMessages] = useState<Message[]>([]);
	const [toggleUserList, setToggleUserList] = useState<boolean>(false);

	const { data: room } = useRoomQuery(idRoom, isConnected); //peut-etre metrre idRoom
	const naivgate = useNavigate();

	useEffect(() => {
		if (!user || !idRoom) {
			naivgate({ to: '/', replace: true });
		} else {
			socket.on('connect', () => {
				socket.emit('join_room', { user: {socketId: socket.id, userId: userContext.user.info.id, userName: userContext.user.info.username}, idRoom });
				setIsConnected(true);
			})
			socket.on('disconnect', () => {
				setIsConnected(false);
			}
			socket.on('chat', (e) => {
				setMessages((messages) => [e, ...messages]);
			}
			socket.connect();
		}
		return () => {
			socket.off('connect')
			socket.off('disconnect')
			socket.off('chat')
		};

	}, []);

	const leaveRoom = () => {
		socket.disconnect();
		unsetRoom();
		naivgate({ to: '/', replace: true });
	}

	const sendMessage = (message: string) => {
		if (user && idRoom) {
			socket.emit('chat',
			{
				user: {
					socketId: user.socketId,
					userId: user.userId,
					userName: user.userName
				},
				timeSent: new Date(Date.now()).toLocaleString('en-US'),
				message,
				idRoom
			 });
		}
	}

	return (
		<>{user?.userId && idRoom && room && (
			<ChatLayout>
				<Header
					isConnected={isConnected}
					users={room?.users ?? []}
					roomName={room?.roomName}
					handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
					handleLeaveRoom={() => leaveRoom()}
				></Header>
				{toggleUserList ? (
					<UserList room={room}></UserList>
				) : (
					<Messages user={user} messages={messages}></Messages>
				)}
				<MessageForm sendMessage={sendMessage}></MessageForm>
			</ChatLayout>
		)}</>
	);
}
