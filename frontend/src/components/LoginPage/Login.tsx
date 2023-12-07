import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Login() {
	async function redirectToBack(e : any)
	{
		e.preventDefault();
		window.location.href = "http://localhost:3030/auth/callback";
		console.log("this is done");
		// const response = await fetch("http://localhost:3030/auth/callback",
		// 	{
		// 		method: "GET",
		// 		headers: {"Content-Type": "application/json"},
		// 	}).then((res) => res.json());
		// console.log(response);
		// console.log("hoho");
	}

	return (
		<div className="container-fluid d-flex justify-content-center">
			<div className="container-form">
					<Form onSubmit={redirectToBack}>
						<Button variant="dark" type="submit" style={{fontSize: '1.4rem'}}>Connect with {" "}
							<img alt="42 Logo" src="https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg"/>
						</Button>
					</Form>
			</div>
		</div>
	);
}

