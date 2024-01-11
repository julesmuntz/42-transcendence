import Container from "react-bootstrap/Container";
import ProfileImg from "./ProfileImg";
import ProfileInfos from "./ProfileInfos";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TFAProfile } from "./TFAProfile";
import { useParams, useNavigate } from "react-router-dom";


export default function PublicProfile() {
	const { id } = useParams();
	const userContext = useContext(UserContext);
	let [user, setUser] = useState(undefined);
	let [done, setDone] = useState(false);

	useEffect(() => {
		let fetchUser = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/${id}`,
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((res) =>
			{
				console.log(res);
				return (res.json());
			}).then((ret) : void => {
				setUser(ret);
			});
		}
		if (!done)
		{
			fetchUser();
			setDone(true);
		}
	}, [user, id, userContext]);

	return (
		<Container className="d-flex">
			<Container></Container>
			<Container className="d-flex flex-column justify-content-center align-items-center">
				<ProfileImg userPublic={user}/>
				<ProfileInfos userPublic={user} />
			</Container>
		</Container>
	);
}
