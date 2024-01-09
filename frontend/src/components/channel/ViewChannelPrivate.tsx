import React, { useContext, useEffect, useState } from 'react';
import { UserContext, useEmits } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { WebSocketContext } from '../../contexts/WebSocketContext';
import { userInfo } from 'os';

interface Channel {
	id: number;
	name: string;
	type: string;
}

export default function ViewChannelPrivate() {

	const [channel, setChannel] = useState<Channel[]>([]);
	const socket = useContext(WebSocketContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useEmits(socket, 'getChannelListPrivate', null);

	useEffect(() => {

		socket?.on('channelPrivate', (data: Channel[]) => {
			setChannel(data);
		});

		socket?.on('updateChannelList', (data: Channel) => {
			setChannel((channel) => [...channel, data]);
		});
		socket?.on('deleteChannel', (data: Channel) => {
			setChannel((channel) => channel.filter((channel) => channel.id !== data.id));
		});
		console.log(channel);
		console.log(userContext.user.info);
		return () => {
			socket?.off('channelPrivate');
			socket?.off('updateChannelList');
			socket?.off('deleteChannel');
		};

	}, [channel, socket]);

	const joinRoom = (roomId: string, type: string) => {
		console.log(roomId);
		if (type === 'private' && userContext.user.info.id !== parseInt(roomId)) {
			return alert('You need an invite.');
		}
		else
			navigate(`/chat/${roomId}`);
	};

	if (channel.length > 0)
		return (
			<div>
				<h1>View Channel</h1>
				{channel.map((channel) => (
					<div key={channel.id}>
						<Button variant="primary" onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}>
							<h2>{channel.name}</h2> </Button>
						<p>{channel.type}</p>
					</div>
				))}
			</div>
		);
	return (
		<div>
			<h1>View Channel</h1>
		</div>
	);
}
