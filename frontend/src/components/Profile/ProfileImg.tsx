import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Image from "react-bootstrap/Image";
import "./css/ProfileImg.css"

export default function ProfileImg({userPublic} : {userPublic: any | undefined}) {
	let user;
	const userContext = useContext(UserContext);
	if (userPublic)
		user = userPublic;
	else
		user = userContext.user.info;
	let statusColor = "violet";

	if (user === "offline")
		statusColor = "gray";
	else if (user === "online")
		statusColor = "#0a5";

	console.log(user.avatarPath);

	return (
		<div className="relative-profile-pic">
			<div
				className="absolute-profile-pic"
				style={{ backgroundColor: `${statusColor}` }}
			/>
			<Image
				src={user.avatarPath ?? user.avatarDefault}
				alt={`${user.username}'s profile picture`}
				className="image"
				roundedCircle
				fluid
			/>
		</div>
	);
}
