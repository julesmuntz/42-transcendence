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

export default function ViewChannelPrivate() {

	const [channel, setChannel] = useState<Channel[]>([]);
	const socket = useContext(WebSocketContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useEmits(socket, 'getChannelListPrivate', null);

	useEffect(() => {
		socket?.on('channelPrivate', (data: Channel[]) => {
			setChannel([]);
			setChannel(data);
		});
		socket?.on('updateChannelListPrivate', (data: Channel) => {
			setChannel((channel) => [...channel, data]);
		});
		socket?.on('deleteChannel', (data: Channel) => {
			setChannel((channel) => channel.filter((channel) => channel.id !== data.id));
		});
		return () => {
			socket?.off('channelPrivate');
			socket?.off('updateChannelListPrivate');
			socket?.off('deleteChannel');
		};

	}, [channel, socket]);


	const joinRoom = (roomId: string, type: string) => {
		console.log(roomId);
		if (type === 'protected') {
			const password = prompt('Enter password');
			fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/channels/password/${roomId}/${password}`, {
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

	async function getUserIdByUsername(target: string): Promise<number | null> {
		const response = await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/search/${target}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${userContext.user.authToken}`,
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		console.log('Response data:', data);
		if (data.error || data.length === 0) {
			return null;
		}
		return data[0].id;
	}

	async function inviteToChannel(channelId: number) {
		const userName = prompt('Enter username');
		const userId = await getUserIdByUsername(userName || '');
		console.log(userId);
		console.log(userName);
		if (userId) {
			socket?.emit('inviteChannels', { userId, channelId });
		}
		else {
			alert('User not found');
		}
	}

	if (channel.length > 0) {
		return (
			<div>
				{channel.map((channel) => (
					<a
						key={channel.name}
						className="list-group-item list-group-item-action border-0"
						onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
					>
						<div className="color_text d-flex align-items-start">
							<div className="flex-grow-1 ml-3">
								{channel.name}
								<div className="small">
									{channel.type}
								</div>
							</div>
						</div>
					</a>
				))}
			</div>
		);
	}
	return (
		<div>
		</div>
	);
}
