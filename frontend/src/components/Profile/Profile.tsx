import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TFAProfile } from "./TFAProfile";
import "./Profile.css";

export default function Profile() {
	const userContext = useContext(UserContext);
	const [qrcode, setQrcode] = useState("");
	const [is2FAActive, setIs2FAActive] = useState(false);

	let getQrcode = async () =>
	{
		return fetch("http://localhost:3030/2fa/generate", {
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
		const response = await getQrcode();
	};

	async function deactivate2FA(e: any) {
		e.preventDefault();
		return fetch("http://localhost:3030/2fa/turn-off" , {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		})
	}

	useEffect(() => {
		if (qrcode) {
			setIs2FAActive(true);
		}
	}, [qrcode]);

	if (is2FAActive)
		return(<TFAProfile qrset={{qrcode, setQrcode}} />);

	return (
		<Container>
			<Image src={userContext.user.info.avatarDefault} className="image" roundedCircle fluid/>
			{!userContext.user.info.isTFAEnabled ? <Button onClick={activate2FA}>Activate 2FA</Button> :
	 <>
		<Button onClick={activate2FA}>Reactivate 2FA</Button>
		<Button onClick={deactivate2FA}>Deactivate 2FA</Button>
	</>
	}
		</Container>
	);
}
