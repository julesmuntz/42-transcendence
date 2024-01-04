import React, { useEffect, useState } from 'react';

// interface Channel {
// 	id: number;
// 	name: string;
// 	type: string;
// }

export default function ViewChannel() {

	// const [channel, setChannel] = useState<Channel[]>([]);

	// useEffect(() => {
	// 	fetch('http://paul-f4Ar1s4:3030/channels', {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 	}).then((res) => res.json())
	// 	.then((ret) => {
	// 		setChannel(ret);
	// 	});
	// }, []);

	// return (
	// 	<div>
	// 		<h1>View Channel</h1>
	// 		{channel.map((channel) => (
	// 			<div key={channel.id}>
	// 				<h2>{channel.name}</h2>
	// 				<p>{channel.type}</p>
	// 			</div>
	// 		))}
	// 	</div>
	// );
	return (
		<div>
			<h1>View Channel</h1>
		</div>
	);
}