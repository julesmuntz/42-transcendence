import Container from "react-bootstrap/Container";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

import "./css/GameHistory.css";

export default function GameHistory({id}: {id: number}) {
	const userContext = useContext(UserContext);
	const [games, setGames] = useState([]);
	const [done, setDone] = useState(false);

	useEffect(() => {
		const getGameHistory = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/games/${id}`,
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((ret) => {
					return (ret.json());
				}).then((res) => {
					setGames(res);
					setDone(true);
				});
		};
		getGameHistory();
	}, [done, userContext, id]);

	if (games.length === 0)
		return (<></>);

	return (
		<Container className="d-flex game-history">
			<p>Game History</p>
			{games.map((game: any, index: number) => {
				return (
					<div key={index} className="d-flex game-score">
						<Link to={`/profile/${game.user1.id}`} className="limited-size">{game.user1.username}</Link>
						<div className="score">{game.score1} - {game.score2}</div>
						<Link to={`/profile/${game.user2.id}`} className="limited-size">{game.user2.username}</Link>
					</div>
				);
			}
			)}
		</Container>
	);
}
