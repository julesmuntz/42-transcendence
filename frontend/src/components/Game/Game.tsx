import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../contexts/UserContext";
import Pong from './Pong';
import './Game.css';

export default function Game() {
	const userContext = useContext(UserContext);
	const user = userContext.user.info;
	const [inGame, setInGame] = useState(user.status === "ingame");

	useEffect(() => {
		if (inGame && user.status !== "ingame")
			userContext.setState("ingame");
	}, [inGame, userContext, user.status]);

	if (inGame)
		return (<Pong />);
	return (<button onClick={() => { setInGame(true); }} className="btn btn-dark goButton" style={{fontSize: '40px'}}>Start a game</button>);
}
