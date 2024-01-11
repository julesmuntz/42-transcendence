import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { UserContext } from '../../contexts/UserContext';
import { Message, Room, UserRoom } from "../../shared/chats.interface";
import { Header, UserList } from './header';
import { ChatLayout, useRoomQuery } from './ChatLayout';
import { MessageForm, Messages } from './footer';
import { WebSocketContext } from '../../contexts/WebSocketContext';

export default function Chat() {
  const userContext = useContext(UserContext);
  const socket = useContext<Socket | undefined>(WebSocketContext);

  const { id: roomName } = useParams<{ id: string }>();

  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);

  const { data: room } = useRoomQuery(roomName as string, isConnected ?? false) || {};
  const [getUser, setUsers] = useState<UserRoom[]>([]);
  const navigate = useNavigate();
	const [user, setUser] = useState<UserRoom>({
		userId: userContext.user.info.id,
		userName: userContext.user.info.username,
		socketId: socket?.id || "",
	});


// setUser({ userId: userContext.user.info.id, userName: userContext.user.info.username, socketId: socket?.id });
  useEffect(() => {
    if (!roomName) {
      navigate('/');
    } else {
      socket?.emit('join_room', { user, roomName: roomName });
      socket?.on('connect_chat', () => {
        setIsConnected(true);
      });
      socket?.on('chat', (e) => {
        setMessages((messages) => [e, ...messages]);
      });
		socket?.on('user_list', (e) => {
			setUsers((getUser) => [e, ...getUser]);
		});
		socket?.on('chat_user', (e : UserRoom) => {
			setUser(e);
		});

    }
    return () => {
      socket?.off('chat');
      socket?.off('connect_chat');
      socket?.off('user_list');
    };
  }, [socket, roomName, navigate]);



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
            users={getUser ?? []}
            roomName={room?.name}
            handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
            handleLeaveRoom={() => leaveRoom()}
          />

          {toggleUserList && socket ? (
            <UserList user={getUser ?? []} hostId={room.host.userId} ></UserList>
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