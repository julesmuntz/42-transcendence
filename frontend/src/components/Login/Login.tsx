import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function Login() {
	return (
		<div className="container-fluid d-flex justify-content-center">
			<div className="container-form">
				<Form>
					<Form.Group className="mb-2">
						<Form.Label>Username</Form.Label>
						<Form.Control type="text" placeholder="potato"/>
					</Form.Group>
					<Form.Group className="mb-2">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="password"/>
					</Form.Group>
					<Button variant="dark" type="submit">Submit</Button>
				</Form>
			</div>
		</div>
	);
}

