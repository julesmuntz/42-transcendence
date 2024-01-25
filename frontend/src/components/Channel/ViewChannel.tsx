import { useContext, useEffect, useState } from "react";
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
	const navigate = useNavigate();

	useEffect(() => {
		const initializeEmits = async () => {
			socket?.emit('getChannel');
		};
		initializeEmits();
	}, [socket]);
	useEffect(() => {
		socket?.on('channelList', (data: Channel[]) => {
			setChannel([]);
			setChannel(data);
		});
		socket?.on('updateListChannel', () => {
			socket?.emit('getChannel');
		});
		socket?.on('updateChannelList', (data: Channel) => {
			setChannel((channel) => [...channel, data]);
		});
		socket?.on('passwordChannel', (roomId: string) => { navigate(`/chat/${roomId}`); });
		return () => {
			socket?.off('channelList');
			socket?.off('updateChannelList');
			socket?.off('passwordChannel');
			socket?.off('updateListChannel');
		};

	}, [channel, socket, navigate]);


	const joinRoom = (roomId: string, type: string) => {
		if (type === 'protected') {
			const password = prompt('Enter password');
			if (!password) {
				alert('Please fill in all fields');
				return;
			}
			socket?.emit('passwordChannel', { channelId: roomId, password: password })
		} else
			socket?.emit('joinChannel', { channelId: roomId });
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
				{channel.find((channel) => channel.type === 'public') &&
					<>
						<p style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#252c38' }}>Public</p>
						<Category>
							<div>
								{channel.map((channel) => (channel.type === 'public') && (
									<div
										key={channel.name}
										className="list-group-item list-group-item-action border-0"
										onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
									>
										<div className="color_text d-flex align-items-start">
											<div style={{ wordBreak: "break-all" }} className="flex-grow-1 ml-3">
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
						<p style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#252c38' }}>Protected</p>
						<Category>
							<div>
								{channel.map((channel) => (channel.type === 'protected') && (
									<div
										key={channel.name}
										className="list-group-item list-group-item-action border-0"
										onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
									>
										<div className="color_text d-flex align-items-start">
											<div style={{ wordBreak: "break-all" }} className="flex-grow-1 ml-3">
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
						<p style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#252c38' }}>Private</p>
						<Category>
							<div>
								{channel.map((channel) => (channel.type === 'private') && (
									<div
										key={channel.name}
										className="list-group-item list-group-item-action border-0"
										onClick={() => joinRoom(channel.name.toString(), channel.type.toString())}
									>
										<div className="color_text d-flex align-items-start">
											<div style={{ wordBreak: "break-all" }} className="flex-grow-1 ml-3">
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
