import React, { useState, useEffect, useContext } from 'react';
import { MakeGenerics, useMatch } from '@tanstack/react-location';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { UserContext } from '../../contexts/UserContext';
import { Message, UserRoom, Room } from "../../shared/chats.interface";
import { Header, UserList, Messages, MessageForm } from './header';
import { useQuery } from 'react-query';
import axios from 'axios';

export const useRoomQuery = (roomName: string, isConnected: boolean) => {
  const query = useQuery({
    queryKey: ['rooms', roomName],
    queryFn: (): Promise<Room> =>
      axios.get(`http://paul-f4Ar8s5:3030/chats/rooms/${roomName}`).then((response) => response.data),
    refetchInterval: 60000,
    enabled: isConnected,
  });
  console.log(query);
  return query;
};

export const ChatLayout = ({ children }: { children: React.ReactElement[] }) => {
  return (
	<div className="container">
	<div className="col-md-12 col-lg-6">
		<div className="panel">
        {children}
		</div>
      </div>
    </div>
  );
};

const socket: Socket = io("http://paul-f4Ar8s5:3030", { autoConnect: false });

// check si le user qui est connecter a bien le droit d'acceder a la room !! pour amies est pour channel
// check aussi si le user est pas ban ou mute de la room sais avec la db

export default function Chat() {
	const userContext = useContext(UserContext);
	const { id: roomName } = useParams<{ id: string }>();


	const [isConnected, setIsConnected] = useState(socket.connected);
	const [messages, setMessages] = useState<Message[]>([]);
	const [toggleUserList, setToggleUserList] = useState<boolean>(false);

	const { data: room } = useRoomQuery(roomName as string, isConnected);
	const navigate = useNavigate();
	const user = { userId: userContext.user.info.id, userName: userContext.user.info.username, socketId: socket.id };

  useEffect(() => {
    if (!roomName) {
		navigate('/');
    } else {
      socket.on('connect', () => {
        socket.emit('join_room', { user: { userId: userContext.user.info.id, userName: userContext.user.info.username, socketId: socket.id as string }, roomName });
        setIsConnected(true);
      });
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
      socket.on('chat', (e) => {
        setMessages((messages) => [e, ...messages]);
      });
      socket.connect();
	  	// socket.emit('get_messages', { roomName });
    }
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
    };
  }, []);



  const leaveRoom = () => {
    socket.disconnect();
    navigate('/');
  };

  const sendMessage = (message: string) => {
    if (user && roomName && room) {
      socket.emit('chat', {
        user: {
          socketId: user.socketId as string,
          userId: user.userId,
          userName: user.userName,
        },
        timeSent: new Date(Date.now()).toLocaleString('en-US'),
        message,
        roomName: room.name,
      });
    }
  };

  return (
    <>
      {user?.userId && roomName && room && (
        <ChatLayout>
          <Header
            isConnected={isConnected}
            users={room?.users ?? []}
            roomName={room?.name}
            handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
            handleLeaveRoom={() => leaveRoom()}
          />

          {toggleUserList ? (
            <UserList room={room} socket={socket}></UserList>
          ) : (
			<>
            <Messages user={user} messages={messages}></Messages>
			<MessageForm sendMessage={sendMessage}></MessageForm>
			</>
          )}

        </ChatLayout>
       )}
    </>
  );
}