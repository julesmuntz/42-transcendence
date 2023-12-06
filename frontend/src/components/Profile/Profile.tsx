import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function Profile() {
	const userContext = useContext(UserContext);

	function activate2FA() {
		//send a request to /auth/generate or something like this
		//it receives a response
		//the user enters a code and sends it to /authenticate
	};

	return (
		<Container>
			<Image src={userContext.user.info.avatarDefault} className="image" roundedCircle fluid/>
			<Button onClick={activate2FA}>Activate 2FA</Button>
		</Container>
	);
}
