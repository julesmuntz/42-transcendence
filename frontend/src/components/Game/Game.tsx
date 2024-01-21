import React, { useState } from 'react';
import Pong from './Pong';

export default function Game() {
	const [inGame, setInGame] = useState(false);

	console.log("hello");

	if (inGame)
		return (<Pong />);
	return (<button onClick={() => { setInGame(true); }}>YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO</button>);
}
