import Container from "react-bootstrap/Container";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function ProfileInfos() {
	const userContext = useContext(UserContext);

	return (
		<Container>
			{/* USERNAME */}
			<div>{userContext.user.info.username}</div>
			{/* STATUS */}
			<div>{userContext.user.info.status}</div>
			{/* EMAIL ADDRESS */}
			<div>{userContext.user.info.email}</div>
			{/* GAME STATS (nb of wins and losses)*/}
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
