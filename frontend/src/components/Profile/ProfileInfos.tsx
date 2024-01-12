import Container from "react-bootstrap/Container";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function ProfileInfos({userPublic} : {userPublic: any | undefined}) {
	let user;
	const userContext = useContext(UserContext);

	if (userPublic)
		user = userPublic;
	else
		user = userContext.user.info;

	return (
		<Container>
			{/* USERNAME */}
			<div>{user.username}</div>
			{/* STATUS */}
			<div>{user.status}</div>
			{/* EMAIL ADDRESS */}
			<div>{user.email}</div>
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
