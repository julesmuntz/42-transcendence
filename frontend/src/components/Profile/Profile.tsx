import Container from "react-bootstrap/Container";
import ProfileImg from "./ProfileImg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TFAProfile } from "./TFAProfile";
import ProfileSecurity from "./ProfileSettings/ProfileSecurity";
import ProfileInfos from "./ProfileInfos";
import FriendNotifications from "./FriendNotifications";
import GameHistory from "./GameHistory";

import "./css/Profile.css";

export default function Profile() {
	const userContext = useContext(UserContext);
	const [qrcode, setQrcode] = useState("");
	const [is2FAActive, setIs2FAActive] = useState(false);

	let getQrcode = async () => {
		return fetch(`http://${process.env.REACT_APP_HOSTNAME}:3000/api/2fa/generate`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then((res) => {
			const reader = res.body?.getReader();
			return new ReadableStream({
				start(controller) {
					return pump();
					function pump(): any {
						return reader?.read().then(({ done, value }) => {
							if (done) {
								controller.close();
								return;
							}
							controller.enqueue(value);
							return pump();
						});
					}
				}
			});
		}).then((stream) => new Response(stream))
			.then((response) => response.blob())
			.then((blob) => URL.createObjectURL(blob))
			.then((url) => setQrcode(url))
			.catch((err) => console.error(err));
	};

	async function activate2FA(e: any) {
		e.preventDefault();
		await getQrcode();
	};

	useEffect(() => {
		if (qrcode) {
			setIs2FAActive(true);
		}
	}, [qrcode]);

	const isActive = () => {
		setIs2FAActive(false);
	}

	if (is2FAActive)
		return (<TFAProfile qrset={{ qrcode, setQrcode }} isActive={ isActive } />);

	if (!userContext.user.info.email)
		return (<></>);

	return (
		<Container className="d-flex">
			<Container>
				<FriendNotifications />
			</Container>
			<Container className="d-flex flex-column justify-content-center align-items-center">
				<ProfileImg userPublic={undefined} />
				<ProfileInfos userPublic={undefined} />
				<GameHistory id={userContext.user.info.id}/>
			</Container>
			<Container>
				<ProfileSecurity qrset={{ qrcode, setQrcode }} />
			</Container>
		</Container>
	);
}
