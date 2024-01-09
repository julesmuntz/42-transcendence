import React, { useContext, useEffect, useState } from 'react';
import { UserContext, useEmits } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { WebSocketContext } from '../../contexts/WebSocketContext';

interface Channel {
	id: number;
	name: string;
	type: string;
}

export default function ViewChannelPublic() {

	const [channel, setChannel] = useState<Channel[]>([]);
	const socket = useContext(WebSocketContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useEmits(socket, 'getChannelListPublic', null);

	useEffect(() => {

		socket?.on('channelPublic', (data: Channel[]) => {
			setChannel(data);
		});

		socket?.on('updateChannelList', (data: Channel) => {
			setChannel((channel) => [...channel, data]);
		});
		socket?.on('deleteChannel', (data: Channel) => {
			setChannel((channel) => channel.filter((channel) => channel.id !== data.id));
		});
		return () => {
			socket?.off('channelPublic');
			socket?.off('updateChannelList');
			socket?.off('deleteChannel');
		};

	}, [channel, socket]);

	const joinRoom = (roomId: string, type: string) => {
		console.log(roomId);
		if (type === 'protected') {
			const password = prompt('Enter password');
			fetch(`http://paul-f4Ar7s7:3030/channels/password/${roomId}/${password}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${userContext.user.authToken}`,
					'Content-Type': 'application/json',
				},
			}).then((res) => res.json())
				.then((ret) => {
					if (ret.error)
						return alert('wrong password');
					else
						return navigate(`/chat/${roomId}`);
				});
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
