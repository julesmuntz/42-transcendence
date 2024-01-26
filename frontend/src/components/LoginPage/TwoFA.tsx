import { useState, useEffect, useContext } from "react";
import { Form } from 'react-bootstrap';
import styled from "styled-components";
import "./css/TwoFA.css"
import { UserContext } from "../../contexts/UserContext";
import Cookies from "js-cookie";

const TwofaBody = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
`;

const TwofaLegend = styled.div`
	margin: 0 auto 1em;
	color: #fff;
	font-weight: bold;
`;

export default function TwoFA({ id }: { id: string }) {
	const [countdown, setCountdown] = useState(30);
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
		await fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/2fa/authenticate`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id, // Assurez-vous que 'id' est défini avant cet appel
				TFACode: code,
			}),
		})
		.then((res) => {
			if (res.status === 200) {
				return res.json(); // Retourne une promesse pour être traitée dans le prochain then
			} else {
				throw new Error("Status not 200");
			}
		})
		.then((id) => {
			const token = Cookies.get('access_token');
			if (token && id.id)
				userContext.setTocken(id.id, token);
		})
		.catch((error) => {
		});
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCountdown((prevCountdown) => (prevCountdown <= 0 ? 30 : prevCountdown - 1));
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (countdown === 0)
			console.log("countdown is 0");
	}, [countdown]);

	return (
		<TwofaBody>
			<div>
				<div className="countdown">
					<div className="countdown-number">{countdown}</div>
					<svg>
						<circle r="18" cx="20" cy="20"></circle>
					</svg>
				</div>
				<Form className="otc" onSubmit={sendCode}>
					<fieldset>
						<TwofaLegend>Validation Code</TwofaLegend>
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
