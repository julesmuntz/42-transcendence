import Container from "react-bootstrap/Container";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";

export default function ProfileModifier() {
	const [show, setShow] = useState(false);
	const userContext = useContext(UserContext);

	const handleShow = () => {
		setShow(true);
	}

	const handleClose = () => {
		setShow(false);
	}

	const modifyInfos = () => {

	}

	return (
		<>
			<Dropdown.Item onClick={handleShow}>
				Modify profile information
			</Dropdown.Item>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>Profile Modification</Modal.Title>
				</Modal.Header>
				<Modal.Body>

				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose}>Close</Button>
					<Button onClick={modifyInfos}>Save changes</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
