import React, { useState, useEffect, useContext, useTransition } from 'react'
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location'
import { io, Socket } from 'socket.io-client'
import { UserContext } from '../../contexts/UserContext'
import { ClientToServerEvents, Message, ServerToClientEvents, UserRoom, Room} from "../../shared/chats.interface";
import { Header, UserList, Messages, MessageForm } from './header';
import { useQuery } from 'react-query';
import axios from 'axios';


export const useRoomQuery = (idRoom: number, isConnected: boolean) => {
	const query = useQuery({
	  queryKey: ['rooms', idRoom],
	  queryFn: (): Promise<Room> =>
		axios.get(`/api/rooms/${idRoom}`).then((response) => response.data),
	  refetchInterval: 60000,
	  enabled: isConnected,
	});
	return query;
  };


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

	const { data: room } = useRoomQuery(idRoom as number, isConnected); //peut-etre metrre idRoom
	const naivgate = useNavigate();

	useEffect(() => {
		if (!user || !idRoom) {
		  naivgate({ to: '/', replace: true });
		} else {
		  socket.on('connect', () => {
			socket.emit('join_room', { user: {socketId: socket.id, userId: userContext.user.info.id, userName: userContext.user.info.username}, idRoom });
			setIsConnected(true);
		  });
		  socket.on('disconnect', () => {
			setIsConnected(false);
		  });
		  socket.on('chat', (e) => {
			setMessages((messages) => [e, ...messages]);
		  });
		  socket.connect();
		}
		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('chat');
		};
	  }, []);

	const leaveRoom = () => {
		socket.disconnect();
		naivgate({ to: '/', replace: true });
	}



	const sendMessage = (message: string) => {
		if (user && idRoom && room) {
			socket.emit('chat', {
				user: {
				  socketId: (user as UserRoom).socketId, // Ensure 'user' is of type UserRoom
				  userId: user.userId,
				  userName: user.userName,
				},
				timeSent: new Date(Date.now()).toLocaleString('en-US'),
				message,
				roomName: room.name,
				idRoom,
			  });

		}
	  };


	return (
		<>{user?.userId && idRoom && room && (
			<ChatLayout>
				<Header
					isConnected={isConnected}
					users={room?.users ?? []}
					roomName={room?.name}
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

type ChatLocationGenerics = MakeGenerics<{
	LoaderData: {
	  user: Pick<UserRoom, 'userId' | 'userName'>
	  idRoom: number
	}
  }>