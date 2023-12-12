import Form from "react-bootstrap/Form";

export default function TwoFA({id, TFASecret} : {id : string, TFASecret :  string }) {

	const sendCode = async (e : any) => {
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
		}).then(res => {
			return res.json();
		}).then(ret => {
			window.location.href = "http://localhost:3000";
		});
	}

	return (<Form onSubmit={sendCode}>
			<input id="2fa_code" type="number" maxLength={6} />
			<button type="submit">Valider</button>
	</Form>)
}
