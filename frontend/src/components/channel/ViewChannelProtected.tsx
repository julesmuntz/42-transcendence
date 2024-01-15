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
			setChannel([]);
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
				<p style={{ fontSize: '15px', textAlign: 'left', backgroundColor: '#26292e' }}>Protected</p>
				<Category>
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
									</div>
								</div>
							</a>
						))}
					</div>
				</Category>
				<br></br>
			</div>
		);
	}
	return (
		<div>
		</div>
	);
}
