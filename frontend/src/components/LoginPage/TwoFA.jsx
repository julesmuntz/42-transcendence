import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

export default function TwoFA() {
	async function redirectToBack(e : any)
	{
		e.preventDefault();
	}

	return (
		<div className="container-fluid d-flex justify-content-center">
			<div className="container-form">
					<Form onSubmit={redirectToBack}>
						<Button variant="dark" type="submit" style={{fontSize: '1.4rem'}}>
							Authenticate
						</Button>
					</Form>
			</div>
		</div>
	);
}

