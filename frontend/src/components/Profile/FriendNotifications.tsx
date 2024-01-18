import Container from "react-bootstrap/Container";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import "./css/FriendNotifications.css";

export default function FriendNotifications() {
	const userContext = useContext(UserContext);
	const socket = useContext(WebSocketContext);
	const [notifs, setNotifs] = useState<IFriends[] | null>(null);

	useEffect(() => {
		const initializeNotifFriend = async () => {
			await new Promise<void>(resolve => {
				if (socket?.connected) {
					resolve();
				} else {
					socket?.on('connect', () => resolve());
				}
			});
			socket?.emit('notification_friendsInvited', { id: null});
		};
		initializeNotifFriend();

		socket?.on('friendsInvited', (e: IFriends[] | null) => {
			setNotifs(null);
			setNotifs(e);
		});

		socket?.on('friendsInviteRemoved', () => {
			socket?.emit('notification_friendsInvited', { id: null});
		});

		return (() => {
			socket?.off('friendsInvited');
			socket?.off('friendsInviteRemoved');
		});
	}, [socket]);

	if (!notifs)
		return null;

	return (
		<Container className="d-flex friend-invites">
			<p>Friend Requests</p>
			{notifs?.map((notif, index) => {
			if (notif?.user1.id !== userContext.user.info.id) {
			return (
				<Container key={index} className="link-to-friend">
					<Link to={`/profile/${notif.user1.id}`} className="link-text">{notif.user1.username}</Link>
				</Container>
			);
			} else {
				return null;
			}
		})}
		</Container>
	);
}
