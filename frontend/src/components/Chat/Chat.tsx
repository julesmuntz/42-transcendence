import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { IFriends, UserContext, useEmits } from '../../contexts/UserContext';
import { Message, UserRoom } from "../../shared/chats.interface";
import { Header, UserList } from './Header';
import { ChatLayout, useRoomQuery } from './ChatLayout';
import MessageForm from './MessageForm';
import Messages from './Messages';
import { WebSocketContext, useSocketEvent } from '../../contexts/WebSocketContext';

export default function Chat() {
	const userContext = useContext(UserContext);
	const socket = useContext<Socket | undefined>(WebSocketContext);

	const { id: roomName } = useParams<{ id: string }>();
	const [isConnected, setIsConnected] = useState(socket?.connected);
	const [messages, setMessages] = useState<Message[]>([]);
	const [toggleUserList, setToggleUserList] = useState<boolean>(false);

	const { data: room } = useRoomQuery(roomName as string, isConnected ?? false);
	const [getUser, setUsers] = useState<UserRoom[]>([]);
	const navigate = useNavigate();
	const [user, setUser] = useState<UserRoom>({
		userId: userContext.user.info.id,
		userName: userContext.user.info.username,
		socketId: socket?.id || "",
		avatarPath: userContext.user.info.avatarPath,
	});

	const [friendBlock, setFriendBlock] = useState<IFriends[] | null>(null);

	useSocketEvent(socket, 'chat', (e: Message) => {
		setMessages((messages) => [e, ...messages]);
	});
	useSocketEvent(socket, 'connect_chat', () => {
		setIsConnected(true);
	});
	useSocketEvent(socket, 'disconnect_chat', () => {
		setIsConnected(false);
	});
	useSocketEvent(socket, 'update_chat_user', () => {
		socket?.emit('update_chat_user', { user, roomName: roomName });
	});
	useSocketEvent(socket, 'user_list', (e: UserRoom[]) => {
		setUsers([]);
		setUsers(e);
	});
	useSocketEvent(socket, 'chat_user', (e: UserRoom) => {
		setUser(e);
		if (e.type === 'regular')
			setToggleUserList(false);
	});

	useSocketEvent(socket, 'deleteChannel', () => {
		navigate('/chat');
	});

	useSocketEvent(socket, 'banned', () => {
		navigate('/chat');
	});

	useEmits(socket, 'friendsBlocked', null);
	useSocketEvent(socket, 'friendsBlocked', (e: IFriends[]) => {
		setFriendBlock(null);
		setFriendBlock(e);
	});

	useEffect(() => {
		const initializeChat = async () => {
			await new Promise<void>(resolve => {
				if (socket?.connected) {
					resolve();
				} else {
					socket?.on('connect', () => resolve());
				}
			});
			socket?.emit('join_room', {
				user: {
					userId: userContext.user.info.id,
					userName: userContext.user.info.username,
					socketId: socket?.id || "",
					avatarPath: userContext.user.info.avatarPath,
				},
				roomName: roomName
			});
		};
		initializeChat();
		return () => {
			setMessages([]);
			setToggleUserList(false);
		};
	}, [socket, roomName, navigate, userContext]);

	const leaveRoom = () => {
		socket?.emit('disconnectRoom', { roomName: roomName });
		navigate('/chat');
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

	const handleDestroyRoom = (roomName: string) => {
		if (roomName) {
			socket?.emit('deleteChannel', { roomName: roomName });
		}
	};

	const handleChangePasswordEvent = (roomName: string, password: string) => {
		if (roomName) {
			socket?.emit('changePassword', { roomName: roomName, password: password });
		}
	}

	const handleChangeTypeEvent = (roomName: string) => {
		if (roomName) {
			socket?.emit('changeType', { roomName: roomName });
		}
	}

	if (!roomName || !room) {
		return (
			<ChatLayout>
				{[
					<div key="join-create-channel" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 220px)" }}>
						<div style={{ color: "gray"}}>
							Join or create a channel
						</div>
					</div>
				]}
			</ChatLayout>
		)
	}

	return (
		<>
			{user?.userId && roomName && room && (
				<ChatLayout>
					<Header
						isConnected={isConnected ?? false}
						users={user}
						roomName={room.name}
						roomType={room.type}
						isChannel={room.channel}
						handleUsersClick={() => setToggleUserList((toggleUserList) => !toggleUserList)}
						handleLeaveRoom={() => leaveRoom()}
						handleDestroyRoom={() => handleDestroyRoom(roomName)}
						handleChangePasswordEvent={(password: string) => handleChangePasswordEvent(roomName, password)}
						handleChangeTypeEvent={() => handleChangeTypeEvent(roomName)}
					/>

					{toggleUserList && socket ? (
						<UserList user={getUser ?? []} hostId={room.host.userId} user_a={user} handleBanUnBan={handleBanUnBan} handelMuteUnMute={handleMuteUnMute} handleKick={handleKick} handlePromote={handlePromote}></UserList>
					) : (
						<>
							<Messages user={user} messages={messages} friends={friendBlock}></Messages>
							<MessageForm sendMessage={sendMessage}></MessageForm>
						</>
					)}
				</ChatLayout>
			)}
		</>
	);
}
