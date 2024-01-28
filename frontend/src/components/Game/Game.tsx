import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../contexts/UserContext";
import Pong from './Pong';
import './Game.css';

export default function Game() {
	const userContext = useContext(UserContext);
	const user = userContext.user.info;
	const [inGame, setInGame] = useState(user.status === "ingame");

	useEffect(() => {
		if (inGame)
			userContext.setState("ingame");
	}, [inGame]);

	if (inGame)
		return (<Pong />);
	return (
		<>
			<button onClick={() => { setInGame(true); }} className="btn btn-dark goButton">
				Start a game
			</button>
			<div className="game_options">
				<h2>Options</h2>
				<hr />
				<div className="game_options_list">
					<ul>
						<li className="key">P</li>
						<li className="key">H</li>
						<li className="key">D</li>
					</ul>
					<ul>
						<li>Ping</li>
						<li>Hide mode</li>
						<li>Dvd theme</li>
					</ul>
				</div>
			</div>
		</>);
}
