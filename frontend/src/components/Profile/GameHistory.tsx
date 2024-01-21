import Container from "react-bootstrap/Container";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

import "./css/GameHistory.css";

export default function GameHistory() {
	const userContext = useContext(UserContext);
	const [games, setGames] = useState([]);
	const [done, setDone] = useState(false);

	useEffect(() => {
		const getGameHistory = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/games/${userContext.user.info.id}`,
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((ret) => {
					return (ret.json());
				}).then((res) => {
					console.log(res);
					setGames(res);
					setDone(true);
				});
		};
		getGameHistory();
	}, [done, userContext]);

	if (games.length === 0)
		return (<></>);

	return (
		<Container className="d-flex game-history">
			<p>Game History</p>
			{games.map((game: any, index: number) => {
				return (
					<div key={index}>
						{game.user1Name} {game.score1} {game.score2} {game.user2Name}
					</div>
				);
			}
			)}
		</Container>
	);
}