import { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import styled from "styled-components";
import "./css/TwoFA.css"

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

export default function TwoFA({ id, TFASecret }: { id: string; TFASecret: string }) {
	const [countdown, setCountdown] = useState(30);

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

	const sendCode = async (e: any) => {
		e.preventDefault();
		const code = (document.getElementById("2fa_code") as HTMLInputElement)?.value;
		await fetch("http://localhost:3030/2fa/authenticate", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id,
				TFASecret: TFASecret,
				TFACode: code,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((ret) => {
				window.location.href = "http://localhost:3000";
			});
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCountdown((prevCountdown) => (prevCountdown <= 0 ? 30 : prevCountdown - 1));
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (countdown == 0)
			window.location.href = "http://localhost:3000";
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
