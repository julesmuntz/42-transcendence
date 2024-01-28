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
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/games/nb-wins/${user.id}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((ret) => ret.json()).then((res) => {
				setNbWins(res);
			});
		};

		const getNbLosses = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/games/nb-losses/${user.id}`, {
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
		<Container className="d-flex flex-column align-items-center">
			<div className="username">{user.username}</div>
			<div className="d-flex">
				<div className="d-flex flex-column justify-content-left">
					<div className="info-title fire">Status</div>
					<div className="info-title fire">Email</div>
					<hr />
					<div className="info-title fire">Wins</div>
					<div className="info-title fire">Losses</div>
				</div>
				<div className="d-flex flex-column justify-content-end">
					<div className="info">{user.status}</div>
					<div className="info">{user.email}</div>
					<hr />
					<div className="info">{nbWins}</div>
					<div className="info">{nbLosses}</div>
				</div>
			</div>
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
