import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	async function redirectToBack(e : any)
	{
		// e.preventDefault();
		// window.location.href = "http://localhost:3030/auth/login";
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

