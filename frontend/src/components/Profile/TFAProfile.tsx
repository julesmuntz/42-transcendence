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
		const inputValue = e.target.value;
		const numericValue = inputValue.replace(/\D/g, "");
		e.target.value = numericValue;
		if (e.target.value.length <= 1) {

			const nextInput = e.target.nextElementSibling;
			if (nextInput !== null) {
				(nextInput as HTMLInputElement).focus();
			}else
			{
				console.log(e.target.value);
			}
			// if (document.getElementsByName("code1").entries().next().value[1].value.length == 1
			// 	&& document.getElementsByName("code2").entries().next().value[1].value.length == 1
			// 	&& document.getElementsByName("code3").entries().next().value[1].value.length == 1
			// 	&& document.getElementsByName("code4").entries().next().value[1].value.length == 1
			// 	&& document.getElementsByName("code5").entries().next().value[1].value.length == 1
			// 	&& document.getElementsByName("code6").entries().next().value[1].value.length == 1) {
			// 		console.log(document.getElementsByName("code1").entries().next().value[1]);
			// 	// sendCode(e);
			// }
		}
	};

	const sendCode = async (e : any) => {
		e.preventDefault();
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
