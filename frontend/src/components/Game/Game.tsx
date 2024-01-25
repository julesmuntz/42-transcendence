import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../contexts/UserContext";
import Pong from './Pong';
import './Game.css';

export default function Game() {
	const userContext = useContext(UserContext);
	const user = userContext.user.info;
	const [inGame, setInGame] = useState(user.status === "ingame");
	console.log(`user.status ${user.status}`);

	useEffect(() => {
		console.log(`user.status useEffect ${user.status}`);
		if (inGame && user.status !== "ingame")
			userContext.setState("ingame");
	}, [inGame]);

	if (inGame)
		return (<Pong />);
	return (<button onClick={() => { setInGame(true); }} className="btn btn-dark goButton" style={{fontSize: '40px'}}>Start a game</button>);
}
