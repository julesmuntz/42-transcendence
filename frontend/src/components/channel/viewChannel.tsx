import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { Socket } from 'dgram';

interface Channel {
	id: number;
	name: string;
	type: string;
}

export default function ViewChannel() {

	const [channel, setChannel] = useState<Channel[]>([]);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://paul-f4Ar7s7:3030/channels', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${userContext.user.authToken}`,
				'Content-Type': 'application/json',
			},
		}).then((res) => res.json())
		.then((ret) => {
			setChannel(ret);
		});
	}, []);

	const joinRoom = (roomId: string, type: string) => {
		console.log(roomId);
		//verifer que sais public pruite ou protected
		//si sais protected demander le password
		//
		if (type === 'protected')
		{
			const password = prompt('Enter password');
			fetch(`http://paul-f4Ar7s7:3030/channels/password/${roomId}:${password}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${userContext.user.authToken}`,
					'Content-Type': 'application/json',
				},
				}).then((res) => res.json())
				.then((ret) => {
					if (ret === 'ok')
						return navigate(`/chat/${roomId}`);
					else
						return alert('wrong password');
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
						<Button variant="primary" onClick={() => joinRoom(channel.name.toString() , channel.type.toString())}>
						<h2>{channel.name}</h2> </Button>
						<p>{channel.type}</p>
					</div>
				))}
			</div>
		);
	// console.log('ViewChannel');
	return (
		<div>
			<h1>View Channel</h1>
		</div>
	);
}