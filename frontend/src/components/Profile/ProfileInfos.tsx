import Container from "react-bootstrap/Container";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

import "./css/ProfileInfo.css"

export default function ProfileInfos({ userPublic }: { userPublic: any | undefined }) {
	let user: any;
	const userContext = useContext(UserContext);
	const [nbWins, setNbWins] = useState(0);
	const [nbLosses, setNbLosses] = useState(0);

	if (userPublic)
		user = userPublic;
	else
		user = userContext.user.info;

	useEffect(() => {
		const getNbWins = async () => {
			console.log(user.id);
			const nbWins = await fetch(`http://localhost:3030/games/nb-wins/${user.id}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((ret) => ret.json()).then((res) => {
				setNbWins(res);
			});
		};

		const getNbLosses = async () => {
			const nbLosses = await fetch(`http://localhost:3030/games/nb-losses/${user.id}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((ret) => ret.json()).then(res => {
				setNbLosses(res);
			});
		};

		getNbWins();
		getNbLosses();
	});

	return (
		<Container>
			{/* USERNAME */}
			{/* <div className="d-flex"> */}
				{/* <div className="info-title">Username</div> */}
				<div className="username">{user.username}</div>
			{/* </div> */}
			{/* STATUS */}
			<div className="d-flex justify-content-center align-items-center">
				<div className="info-title fire">Status</div>
				<div className="info">{user.status}</div>
			</div>
			{/* EMAIL ADDRESS */}
			<div className="d-flex justify-content-center align-items-center">
				<div className="info-title fire">Email</div>
				<div className="info">{user.email}</div>
			</div>
			<hr/>
			{/* GAME STATS (nb of wins and losses)*/}
			<div className="d-flex justify-content-center align-items-center">
				<div className="info-title fire">Wins</div>
				<div className="info">{nbWins}</div>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="info-title fire">Losses</div>
				<div className="info">{nbLosses}</div>
			</div>
			{/* <div>{nbWins === 1 ? `${nbWins} win` : `${nbWins} wins`}</div>
			<div>{nbLosses === 1 ? `${nbLosses} loss` : `${nbLosses} losses`}</div> */}
		</Container>
	);
}


/*
	What should we be able to do in the profile?

	- We should be able to view some info about the user:
		- its username
		- its status
		- his friends?
		- his game history?

	What should he be able to change?

	- His profile picture.
	- His username or not??? Do we give him this liberty
*/
