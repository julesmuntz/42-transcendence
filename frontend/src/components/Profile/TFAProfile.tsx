import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import "../LoginPage/css/TwoFA.css"
import "./Profile.css"

const TwofaBody = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
`;

export function TFAProfile({ qrset } : {qrset : {qrcode : string, setQrcode : any}}) {

	const userContext = useContext(UserContext);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const inputValue = e.target.value;
		const numericValue = inputValue.replace(/\D/g, "");
		const codeInputNames = ["code1", "code2", "code3", "code4", "code5", "code6"];
		let code = "";

		e.target.value = numericValue;
		if (e.target.value.length == 1) {
			const nextInput = e.target.nextElementSibling;
			if (nextInput !== null) {
				(nextInput as HTMLInputElement).focus();
			}else
			{
				codeInputNames.forEach((name) => {
					const input = document.getElementsByName(name)[0] as HTMLInputElement;
					code += input.value;
				});
				if (code.length == 6)
					sendCode(code);
			}
		}
	};

	const sendCode = async (e : any) => {
		const code = (document.getElementById("2fa_code") as HTMLInputElement)?.value;
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
				const newUser = ret;
				qrset.setQrcode("");
				userContext.login(newUser, userContext.user.authToken);
				window.location.href = "http://localhost:3000";
			}
			);
	}

	return (
		<TwofaBody>
			<div>
			<img className="qrcode" src={`${qrset.qrcode}`} alt="qrcode"/>
			<Form className="otc" onSubmit={sendCode}>
				<fieldset>
					<div className="twofa-div">
						<input name="code1" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} required />
						<input name="code2" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} required />
						<input name="code3" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} required />
						<input name="code4" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} required />
						<input name="code5" type="number" pattern="[0-1]{1}" maxLength={1} onInput={handleInput} required />
						<input name="code6" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} required />
					</div>
				</fieldset>
			</Form>

			</div>
		</TwofaBody>
	);
}
