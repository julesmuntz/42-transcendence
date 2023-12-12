import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./css/TwoFA.css"

export default function TwoFA({ id, TFASecret }: { id: string; TFASecret: string }) {
	const [countdown, setCountdown] = useState(30);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const numericValue = inputValue.replace(/\D/g, "");
		e.target.value = numericValue;
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

	// useEffect(() => {
	// 	if (countdown == 0)
	// 	window.location.href = "http://localhost:3000";
	// }, [countdown]);

	return (
		<>
			<Form onSubmit={sendCode}>
				<input id="2fa_code" type="number" pattern="[0-9]{6}" maxLength={6} onInput={handleInput} required />
				<button type="submit">Valider</button>
			</Form>
			<div id="countdown">
				<div id="countdown-number">{countdown}</div>
			</div>
		</>
	);
}
