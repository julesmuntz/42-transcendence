import Container from "react-bootstrap/Container";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

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

	return (
		<Container>
		  {notifs?.map((notif, index) => {
			if (notif.user1.id !== userContext.user.info.id) {
			  return (
				<Container className="d-flex" key={index}>
				  <div>Invited by </div>
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