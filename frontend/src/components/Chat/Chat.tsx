import React, { useState, useEffect, useContext } from 'react';
import { MakeGenerics, useMatch } from '@tanstack/react-location';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { UserContext } from '../../contexts/UserContext';
import { ClientToServerEvents, Message, ServerToClientEvents, UserRoom, Room } from "../../shared/chats.interface";
import { Header, UserList, Messages, MessageForm } from './header';
import { useQuery } from 'react-query';
import axios from 'axios';

export const useRoomQuery = (idRoom: string, isConnected: boolean) => {
  const query = useQuery({
    queryKey: ['rooms', idRoom],
    queryFn: (): Promise<Room> =>
      axios.get(`http://localhost:3030/chats/rooms/${idRoom}`).then((response) => response.data),
    refetchInterval: 60000,
    enabled: isConnected,
  });
  console.log(query);
  return query;
};

export const ChatLayout = ({ children }: { children: React.ReactElement[] }) => {
  return (
    <div className="mx-auto flex h-screen w-screen justify-center bg-gray-900">
      <div className="flex h-full w-full flex-col px-2 md:w-8/12 lg:w-6/12 xl:w-4/12">
        {children}
      </div>
    </div>
  );
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3030", { autoConnect: false });

export default function Chat() {
  const userContext = useContext(UserContext);
  const match = useMatch<ChatLocationGenerics>();
  const { id: idRoom } = useParams<{ id: string }>();

  const user = { userId: userContext.user.info.id, userName: userContext.user.info.username, socketId: socket.id };
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);

  const { data: room } = useRoomQuery(idRoom as string, isConnected);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !idRoom) {
		navigate('/');
    } else {
		console.log("user and idRoom", user, idRoom);
      socket.on('connect', () => {
        socket.emit('join_room', { user, idRoom });
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
    navigate('/');
  };

  const sendMessage = (message: string) => {
    if (user && idRoom && room) {
      socket.emit('chat', {
        user: {
          socketId: (user as UserRoom).socketId,
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
    <>
      {user?.userId && idRoom && room && (
        <ChatLayout>
          <Header
            isConnected={isConnected}
            users={room?.users ?? []}
            roomName={room?.name}
            handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
            handleLeaveRoom={() => leaveRoom()}
          />
          {toggleUserList ? (
            <UserList room={room}></UserList>
          ) : (
            <Messages user={user} messages={messages}></Messages>
          )}
          <MessageForm sendMessage={sendMessage}></MessageForm>
        </ChatLayout>
      )}
    </>
  );
}

export const loader = async () => {
  return {
    idRoom: sessionStorage.getItem('idRoom'),
  };
};

type ChatLocationGenerics = MakeGenerics<{
  LoaderData: {
    idRoom: string;
  };
}>;
