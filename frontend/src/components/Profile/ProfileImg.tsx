import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Image from "react-bootstrap/Image";
import "./css/ProfileImg.css"

export default function ProfileImg() {
	const userContext = useContext(UserContext);
	let statusColor = "violet";

	if (userContext.user.info.status === "offline")
		statusColor = "gray";
	else if (userContext.user.info.status === "online")
		statusColor = "#0b0";

	return (
		<div className="relative-profile-pic">
			<div
				className="absolute-profile-pic"
				style={{backgroundColor: `${statusColor}`}}
			/>
			<Image
				src={userContext.user.info.avatarDefault}
				alt={`${userContext.user.info.username}'s profile picture`}
				className="image"
				roundedCircle
				fluid/>
		</div>
	);
}
