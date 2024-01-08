import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  Socket } from 'socket.io-client';
import { UserContext } from '../../contexts/UserContext';
import { Message, UserRoom, Room } from "../../shared/chats.interface";
import { Header, UserList, Messages, MessageForm } from './header';
import { useQuery } from 'react-query';
import axios from 'axios';
import { WebSocketContext } from '../../contexts/WebSocketContext';

export const useRoomQuery = (roomName: string, isConnected: boolean) => {
  const query = useQuery({
    queryKey: ['rooms', roomName],
    queryFn: (): Promise<Room> =>
      axios.get(`http://paul-f4Ar5s7:3030/chats/rooms/${roomName}`).then((response) => response.data),
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

export default function Chat() {
	const userContext = useContext(UserContext);
  const { id: roomName } = useParams<{ id: string }>();
  const socket = useContext<Socket | undefined>(WebSocketContext);

	const [isConnected, setIsConnected] = useState(socket?.connected);
	const [messages, setMessages] = useState<Message[]>([]);
	const [toggleUserList, setToggleUserList] = useState<boolean>(false);
	const [users, setRoomUsers] = useState<UserRoom[]>([]);

	const { data: room } = useRoomQuery(roomName as string, isConnected ?? false);
	const navigate = useNavigate();
	const user = { userId: userContext.user.info.id, userName: userContext.user.info.username, socketId: socket?.id };

  useEffect(() => {
    if (!roomName) {
		navigate('/');
    } else {
      socket?.on('connect', () => {
        socket?.emit('join_room', { user: { userId: userContext.user.info.id, userName: userContext.user.info.username, socketId: socket?.id as string }, roomName });
        setIsConnected(true);
      });
      socket?.on('disconnect', () => {
        setIsConnected(false);
      });
      socket?.on('chat', (e) => {
        setMessages((messages) => [e, ...messages]);
      });
      socket?.connect();
    }
    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('chat');
    };
  }, [socket, roomName, navigate, userContext.user.info.id, userContext.user.info.username]);



  const leaveRoom = () => {
    socket?.disconnect();
    navigate('/');
  };

  const sendMessage = (message: string) => {
    if (user && roomName && room) {
      socket?.emit('chat', {
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
            isConnected={isConnected ?? false}
            users={room?.users ?? []}
            roomName={room?.name}
            handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
            handleLeaveRoom={() => leaveRoom()}
          />

          {toggleUserList && socket ?(
            <UserList room={room} socket={socket} user={user}></UserList>
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