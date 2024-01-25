import Container from "react-bootstrap/Container";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import "./css/FriendNotifications.css";

export default function FriendNotifications() {
	const userContext = useContext(UserContext);
	const socket = useContext(WebSocketContext);
	const [notifs, setNotifs] = useState<Info[] | null>(null);

	useEffect(() => {
		const initializeNotifFriend = async () => {
			socket?.emit('notification_friendsInvited', { id: null});
		};
		initializeNotifFriend();

		socket?.on('friendsInvited', (e: IFriends[] | null) => {
			setNotifs(null);
			if (e)
			{
				for (const friend of e) {
					if (friend.user2.id === userContext.user.info.id) {
						setNotifs((notifs) => [friend.user1, ...(notifs || [])]);
					}
				}
			}
		});
		socket?.on('friendsInviteRemoved', () => {
			socket?.emit('notification_friendsInvited', { id: null});
		});
		return (() => {
			socket?.off('friendsInvited');
			socket?.off('friendsInviteRemoved');
			setNotifs(null);
		});
	}, [socket, userContext.user.info.id]);

	if (!notifs)
		return null;

	return (
		<Container className="d-flex friend-invites">
			<p>Friend Requests</p>
			{notifs.map((notif, index) => {
			if (notif.id !== userContext.user.info.id) {
			return (
				<Container key={index} className="link-to-friend">
					<Link to={`/profile/${notif.id}`} className="link-text">{notif.username}</Link>
				</Container>
			);
			} else {
				return null;
			}
		})}
		</Container>
	);
}
