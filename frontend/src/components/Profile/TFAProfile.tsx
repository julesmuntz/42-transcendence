import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserContext, Info } from '../../contexts/UserContext';
import { useContext, useEffect } from 'react';

export function TFAProfile({ qrset } : {qrset : {qrcode : string, setQrcode : any}}) {

	const userContext = useContext(UserContext);

	const sendCode = async (e : any) => {
		e.preventDefault();
		const code = (document.getElementById("2fa_code") as HTMLInputElement)?.value;
		console.log(code);
		await fetch("http://localhost:3030/2fa/turn-on", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				TFACode: code,
			}),
		})
		.then(
			(res) => {
				return res.json();
			})
			.then((ret) => {
				console.log(ret);
				const newUser = ret;
				qrset.setQrcode("");
				console.log("updating the user");
				userContext.login(newUser, userContext.user.authToken);
				window.location.href = "http://localhost:3000";
			}
			);
	}

	return (
		<>
			<img src={`${qrset.qrcode}`} alt="qrcode"/>
			<Form onSubmit={sendCode}>
				<input id="2fa_code" type="text" maxLength={6} required/>
				<Button type="submit">Send</Button>
			</Form>
		</>
	);
}
