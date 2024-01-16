import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { UserContext } from '../../contexts/UserContext';
import { Message, UserRoom } from "../../shared/chats.interface";
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
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRoom>({
    userId: userContext.user.info.id,
    userName: userContext.user.info.username,
    socketId: socket?.id || "",
    avatarPath: userContext.user.info.avatarPath,
  });

  useEffect(() => {
    if (!socket?.connected)
    {
        setDone(!done);
        return ;
    }
    let newUser = user;
    newUser.socketId = socket?.id || '';
    setUser(newUser);
    if (!roomName) {
		  navigate('/');
    } else {
      socket?.emit('join_room', { user, roomName: roomName });
      socket?.on('connect_chat', () => {
        setIsConnected(true);
      });
      setIsConnected(true);

      socket?.on('chat', (e) => {
        setMessages((messages) => [e, ...messages]);
      });

      socket?.on('user_list', (e: UserRoom[]) => {
        setUsers([]);
        setUsers(e);
      });

      socket?.on('chat_user', (e: UserRoom) => {
        setUser(e);
      });

      socket?.on('banned', () => {
        navigate('/');
      });

	  socket?.on('update_chat_user', () => {
		socket?.emit('update_chat_user', { user, roomName: roomName });
	  });
	  socket?.on('deleteChannel', () => {
		navigate('/');
	  });

    }
    return () => {
		socket?.off('chat');
		socket?.off('connect_chat');
		socket?.off('user_list');
		socket?.off('chat_user');
		socket?.off('banned');
		socket?.off('update_chat_user');
		socket?.off('deleteChannel');
		setMessages([]);
		setToggleUserList(false);
	};
  }, [socket, roomName, navigate, done]);


  // a changer pour le leave channels
  const leaveRoom = () => {
    socket?.emit('disconnect_room');
    navigate('/');
  };

  const sendMessage = (message: string) => {
    if (user && roomName && room) {
      socket?.emit('chat', {
        user,
        timeSent: new Date(Date.now()).toLocaleString('en-US'),
        message,
        roomName: room.name,
      });
    }
  };

  const handleBanUnBan = (user: UserRoom) => {
    if (user && roomName) {
      if (user.ban) {
        socket?.emit('unbanChannel', { userId: user.userId, roomName: roomName });
      } else {
        socket?.emit('banChannel', { userId: user.userId, roomName: roomName });
      }
    }
  };

  const handleMuteUnMute = (user: UserRoom) => {
    if (user && roomName) {
      if (user.muted) {
        socket?.emit('unmuteChannel', { userId: user.userId, roomName: roomName });
      } else {
        socket?.emit('muteChannel', { userId: user.userId, roomName: roomName });
      }
    }
  };

  const handleKick = (user: UserRoom) => {
    if (user && roomName) {
      socket?.emit('kickChannel', { userId: user.userId, roomName: roomName });
    }
  };

  const handlePromote = (user: UserRoom) => {
    if (user && roomName) {
      if (user.type === 'Admin')
        socket?.emit('demoteChannel', { userId: user.userId, roomName: roomName });
      else
        socket?.emit('promoteChannel', { userId: user.userId, roomName: roomName });
    }
  };

  	const handleDestroyRoom = (roomName : string) => {
		if (roomName) {
			socket?.emit('deleteChannel', { roomName: roomName });
		}
	};

  return (
    <>
      {user?.userId && roomName  && room && (
        <ChatLayout>
          <Header
            isConnected={isConnected ?? false}
            users={user}
            roomName={room.name}
            isChannel={room.channel}
            handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
            handleLeaveRoom={() => leaveRoom()}
			handleDestroyRoom={() => handleDestroyRoom(roomName)}
          />

          {toggleUserList && socket ? (
            <UserList user={getUser ?? []} hostId={room.host.userId} user_a={user} handleBanUnBan={handleBanUnBan} handelMuteUnMute={handleMuteUnMute} handleKick={handleKick} handlePromote={handlePromote}></UserList>
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