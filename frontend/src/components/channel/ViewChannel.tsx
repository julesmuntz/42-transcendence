import { useContext, useEffect, useState } from "react";
import { UserContext, useEmits } from "../../contexts/UserContext";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useNavigate } from 'react-router-dom'

interface Channel {
	id: number;
	name: string;
	type: string;
}

export default function ViewChannel() {

	const [channel, setChannel] = useState<Channel[]>([]);
	const socket = useContext(WebSocketContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useEmits(socket, 'getChannel', null);

	useEffect(() => {
		socket?.on('channelList', (data: Channel[]) => {
			setChannel([]);
			setChannel(data);
		});
		socket?.on('updateType', () => {
			console.log('updateType');
			socket?.emit('getChannel');
		});
		socket?.on('updateChannelList', (data: Channel) => {
			setChannel((channel) => [...channel, data]);
		});
		socket?.on('deleteChannel', (data: Channel) => {
			setChannel((channel) => channel.filter((channel) => channel.id !== data.id));
		});
		socket?.on('passwordChannel', (roomId: string) => {navigate(`/chat/${roomId}`);	});

		return () => {
			socket?.off('channelList');
			socket?.off('updateChannelList');
			socket?.off('deleteChannel');
			socket?.off('passwordChannel');
		};

	}, [channel, socket, navigate]);


	const joinRoom = (roomId: string, type: string) => {
		if (type === 'protected') {
			const password = prompt('Enter password');
			if (!password) {
				alert('Please fill in all fields');
				return;
			}
			socket?.emit('passwordChannel', {channelId: roomId, password: password, userId: userContext.user.info.id})
		}else
			socket?.emit('joinChannel', { userId: userContext.user.info.id, channelId: roomId });
	};

	// async function getUserIdByUsername(target: string): Promise<number | null> {
	// 	const response = await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/search/${target}`, {
	// 		method: 'GET',
	// 		headers: {
	// 			Authorization: `Bearer ${userContext.user.authToken}`,
	// 			'Content-Type': 'application/json',
	// 		},
	// 	});
	// 	const data = await response.json();
	// 	if (data.error || data.length === 0) {
	// 		return null;
	// 	}
	// 	return data[0].id;
	// }

	// async function inviteToChannel(channelId: number) {
	// 	const userName = prompt('Enter username');
	// 	const userId = await getUserIdByUsername(userName || '');
	// 	if (userId) {
	// 		socket?.emit('inviteChannels', { userId, channelId });
	// 	}
	// 	else {
	// 		alert('User not found');
	// 	}
	// }

	function Category({ children }: { children: React.ReactNode }) {
		return (
			<div style={{ border: '1px solid #3f3f3f', borderRadius: '5px' }}>
				<div>{children}</div>
			</div>
		);
	}

	if (channel.length > 0) {
		return (
			<div>
				{channel.find((channel) => channel.type === 'public') &&
					<>
						<p style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#26292e' }}>Public</p>
						<Category>
							<div>
								{channel.map((channel) => (channel.type === 'public') && (
									<div
										key={channel.name}
										className="list-group-item list-group-item-action border-0"
										onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
									>
										<div className="color_text d-flex align-items-start">
											<div className="flex-grow-1 ml-3">
												{channel.name}
											</div>
										</div>
									</div>
								))}
							</div>
						</Category>
						<br></br>
					</>
				}
				{channel.find((channel) => channel.type === 'protected') &&
					<>
						<p style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#26292e' }}>Protected</p>
						<Category>
							<div>
								{channel.map((channel) => (channel.type === 'protected') && (
									<div
										key={channel.name}
										className="list-group-item list-group-item-action border-0"
										onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
									>
										<div className="color_text d-flex align-items-start">
											<div className="flex-grow-1 ml-3">
												{channel.name}
											</div>
										</div>
									</div>
								))}
							</div>
						</Category>
						<br></br>
					</>
				}
				{channel.find((channel) => channel.type === 'private') &&
					<>
						<p style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#26292e' }}>Private</p>
						<Category>
							<div>
								{channel.map((channel) => (channel.type === 'private') && (
									<div
										key={channel.name}
										className="list-group-item list-group-item-action border-0"
										onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
									>
										<div className="color_text d-flex align-items-start">
											<div className="flex-grow-1 ml-3">
												{channel.name}
											</div>
										</div>
									</div>
								))}
							</div>
						</Category>
						<br></br>
					</>
				}
			</div>
		);
	}
	return (
		<div>
		</div>
	);
}
