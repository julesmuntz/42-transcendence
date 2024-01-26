import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import "../LoginPage/css/TwoFA.css";
import "./css/Profile.css";

const TwofaBody = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
`;

export function TFAProfile({ qrset, isActive }: { qrset: { qrcode: string, setQrcode: any }, isActive: () => void }) {

	const userContext = useContext(UserContext);
	let code = "";
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const inputValue = e.target.value;
		const numericValue = inputValue.replace(/\D/g, "");
		const codeInputNames = ["code1", "code2", "code3", "code4", "code5", "code6"];


		e.target.value = numericValue;
		if (e.target.value.length === 1) {
			const nextInput = e.target.nextElementSibling;
			if (nextInput !== null) {
				(nextInput as HTMLInputElement).focus();
			} else {
				codeInputNames.forEach((name) => {
					const input = document.getElementsByName(name)[0] as HTMLInputElement;
					code += input.value;
				});
				if (code.length === 6)
					sendCode(code);
			}
		}
	};

	const handleClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.preventDefault();
		const input = e.target as HTMLInputElement;
		input.value = "";
		const codeInputNames = ["code1", "code2", "code3", "code4", "code5", "code6"];


		if ((e.currentTarget.name === "code1") || (e.currentTarget.name === "code2") || (e.currentTarget.name === "code3") || (e.currentTarget.name === "code4") || (e.currentTarget.name === "code5") || (e.currentTarget.name === "code6")) {
			codeInputNames.forEach((name) => {
				(document.getElementsByName(name)[0] as HTMLInputElement).value = "";
			});
			input.value = "";
			(document.getElementsByName("code1")[0] as unknown as HTMLInputElement).focus();
		}
	}

	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const codeInputNames = ["code1", "code2", "code3", "code4", "code5", "code6"];
		if (e.key === "Tab") {
			e.preventDefault();
			if ((e.currentTarget.name === "code1") || (e.currentTarget.name === "code2") || (e.currentTarget.name === "code3") || (e.currentTarget.name === "code4") || (e.currentTarget.name === "code5") || (e.currentTarget.name === "code6")) {
				codeInputNames.forEach((name) => {
					(document.getElementsByName(name)[0] as HTMLInputElement).value = "";
				});
				(document.getElementsByName("code1")[0] as unknown as HTMLInputElement).focus();
			}
		}
		if (e.key === "Backspace") {
			e.preventDefault();
			if ((e.currentTarget.name === "code1") || (e.currentTarget.name === "code2") || (e.currentTarget.name === "code3") || (e.currentTarget.name === "code4") || (e.currentTarget.name === "code5") || (e.currentTarget.name === "code6")) {
				const input = e.target as HTMLInputElement;
				input.value = "";
				const prevInput = input.previousElementSibling;
				if (prevInput !== null) {
					(prevInput as HTMLInputElement).value = "";
					(prevInput as HTMLInputElement).focus();
				}
			}
		}
	}

	const sendCode = async (e: any) => {
		await fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/2fa/turn-on`, {
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
					console.log(res)
					if (res.status === 201) {
						return res.json();
					} else {
						throw new Error("Wrong authentication code");
					}
				})
			.then((ret) => {
				const newUser = ret;
				qrset.setQrcode("");
				console.log(newUser);
				userContext.login(newUser, userContext.user.authToken);
				isActive();
			}
			).catch((err) => {
				console.log(err);
				isActive();

			});
	}

	return (
		<TwofaBody>
			<div>
				<img className="qrcode" src={`${qrset.qrcode}`} alt="qrcode" />
				<Form className="otc" onSubmit={sendCode}>
					<fieldset>
						<div className="twofa-div">
							<input name="code1" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} onClick={handleClick} onKeyDown={handleKey} required />
							<input name="code2" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} onClick={handleClick} onKeyDown={handleKey} required />
							<input name="code3" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} onClick={handleClick} onKeyDown={handleKey} required />
							<input name="code4" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} onClick={handleClick} onKeyDown={handleKey} required />
							<input name="code5" type="number" pattern="[0-1]{1}" maxLength={1} onInput={handleInput} onClick={handleClick} onKeyDown={handleKey} required />
							<input name="code6" type="number" pattern="[0-9]{1}" maxLength={1} onInput={handleInput} onClick={handleClick} onKeyDown={handleKey} required />
						</div>
					</fieldset>
				</Form>
			</div>
		</TwofaBody>
	);
}
