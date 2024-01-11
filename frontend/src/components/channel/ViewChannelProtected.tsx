import { useContext, useEffect, useState } from "react";
import { UserContext, useEmits } from "../../contexts/UserContext";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';

interface Channel {
	id: number;
	name: string;
	type: string;
}

export default function ViewChannelProtected() {

	const [channel, setChannel] = useState<Channel[]>([]);
	const socket = useContext(WebSocketContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useEmits(socket, 'getChannelListProtected', null);

	useEffect(() => {
		socket?.on('channelProtected', (data: Channel[]) => {
			setChannel(data);
		});
		socket?.on('updateChannelListProtected', (data: Channel) => {
			setChannel((channel) => [...channel, data]);
		});
		socket?.on('deleteChannel', (data: Channel) => {
			setChannel((channel) => channel.filter((channel) => channel.id !== data.id));
		});
		return () => {
			socket?.off('channelProtected');
			socket?.off('updateChannelListProtected');
			socket?.off('deleteChannel');
		};

	}, [channel, socket]);


	const joinRoom = (roomId: string, type: string) => {
		console.log(roomId);
		if (type === 'protected') {
			const password = prompt('Enter password');
			fetch(`http://paul-f4Ar7s11:3030/channels/password/${roomId}/${password}`, {
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
				<h1>Protected Channels</h1>
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
			<h1>Protected Channels</h1>
		</div>
	);
}