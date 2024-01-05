import Container from "react-bootstrap/Container";
import ProfileImg from "./ProfileImg";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TFAProfile } from "./TFAProfile";
import ProfileSecurity from "./ProfileSettings/ProfileSecurity";
import ProfileInfos from "./ProfileInfos";

import "./Profile.css";

export default function Profile() {
	const userContext = useContext(UserContext);
	const [qrcode, setQrcode] = useState("");
	const [is2FAActive, setIs2FAActive] = useState(false);

	let getQrcode = async () =>
	{
		return fetch(`http://paul-f4Ar7s8:3030/2fa/generate`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then((res) => {
			const reader = res.body?.getReader();
			return new ReadableStream({
				start(controller) {
					return pump();
					function pump() : any{
						return reader?.read().then(({ done, value }) => {
							if (done) {
								controller.close();
								return ;
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

	async function activate2FA(e : any) {
		e.preventDefault();
		await getQrcode();
	};

	async function deactivate2FA(e: any) {
		e.preventDefault();
		return fetch(`http://paul-f4Ar7s8:3030/2fa/turn-off` , {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then(() => {
			const newUser = userContext.user.info;
			newUser.isTFAEnabled = false;
			userContext.login(newUser, userContext.user.authToken);
		});
	}

	useEffect(() => {
		if (qrcode) {
			setIs2FAActive(true);
		}
	}, [qrcode]);

	if (is2FAActive)
		return(<TFAProfile qrset={{qrcode, setQrcode}} />);

	return (
		<Container className="d-flex">
			<Container></Container>
			<Container className="d-flex flex-column justify-content-center align-items-center">
				<ProfileImg />
				<ProfileInfos />
			</Container>
			<Container>
				<ProfileSecurity qrset={{qrcode, setQrcode}}/>
			</Container>
		</Container>
	);
}
