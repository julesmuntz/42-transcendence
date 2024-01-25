import Container from "react-bootstrap/Container";
import ProfileImg from "./ProfileImg";
import ProfileInfos from "./ProfileInfos";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import Friends from "../Friends/Friends";
import GameHistory from "./GameHistory";

export default function PublicProfile() {
	const { id } = useParams();
	const userContext = useContext(UserContext);
	let [user, setUser] = useState<any | undefined>(undefined);
	let [done, setDone] = useState(false);
	const nav = useNavigate();
	useEffect(() => {
		if (id && userContext.user.info.id === parseInt(id)) {
			nav('/profile');
		}
		let fetchUser = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/${id}`,
				{
					method: "GET",
					headers: {
						"Authorization": `Bearer ${userContext.user.authToken}`
					}
				}).then((res) => {
					return (res.json());
				}).then((ret): void => {
					if (!ret.error && !ret.message)
						setUser(ret);
				});
		}
		if (!done) {
			fetchUser();
			setDone(true);
		}
	}, [user, id, userContext, nav, done]);

	if (id && userContext.user.info.id === parseInt(id)) {
		return (<></>);
	}

	if (!user)
		return (<>
			<div>
				User not found
			</div>
		</>);

	return (
		<Container className="d-flex">
			<Container>
			</Container>
			<Container className="d-flex flex-column justify-content-center align-items-center">
				<ProfileImg userPublic={user} />
				<ProfileInfos userPublic={user} />
				<GameHistory />
			</Container>
			<Container>
				{id && <Friends IdUserTarget={parseInt(id)} />}
			</Container>
		</Container>
	);
}
