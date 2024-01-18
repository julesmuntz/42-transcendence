import Container from "react-bootstrap/Container";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import "./css/FriendNotifications.css";

export default function FriendNotifications() {
	const userContext = useContext(UserContext);
	const socket = useContext(WebSocketContext);
	const [notifs, setNotifs] = useState<IFriends[] | null>([]);

	useEffect(() => {
		socket?.emit('notification_friendsInvited', { id: null});
		socket?.on('friendsInvited', (e: IFriends[] | null) => {
			const notifArr = e;
			if (notifArr !== null)
				setNotifs(notifArr);
			else
				setNotifs([]);
		});
	}, [socket]);

	if (notifs)
	{
		return (
			<Container className="d-flex friend-invites">
				<h3>Friend Invites</h3>
				{notifs?.map((notif, index) => {
				if (notif.user1.id !== userContext.user.info.id) {
				return (
					<Container key={index} className="link-to-friend">
						<Link to={`/profile/${notif.user1.id}`} className="link-text">{notif.user1.username}</Link>
					</Container>
				);
				} else {
					return null; // or any other value that makes sense in your context
				}
			})}
			</Container>
		);
	}
	return (<></>);
}
