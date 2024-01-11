import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";

export default function ProfileModifier() {
	const [show, setShow] = useState(false);
	const userContext = useContext(UserContext);
	const [srcImg, setSrcImg] = useState(userContext.user.info.avatarPath);

	const handleShow = () => {
		setShow(true);
	}

	const handleClose = () => {
		setShow(false);
	}

	const changeImage = (e : any) => {
		if (e.target.files[0])
		{
			const src = URL.createObjectURL(e.target.files[0]);
			setSrcImg(src);
			console.log(src);
		}
	}

	const modifyInfos = async (e : any) => {
		e.preventDefault();
		console.log(e.target);
		const form: FormData = new FormData();
		form.append('customFile', e.target[0].files[0]);
		const newUsername = e.target[1].value;

		if (e.target[0].files[0])
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/upload/${userContext.user.info.id}`, {
					method: "POST",
					headers: {
						"Authorization": `Bearer ${userContext.user.authToken}`,
					},
					body: form
				}).then((res) => {
					console.log(res);
					return (res.json());
				}).then((ret) => {
					console.log(ret);
					if (ret.statusCode === 200)
					{
						console.log("coco");
						const newUser = userContext.user.info;
						newUser.avatarPath = ret.data;
						userContext.login(newUser, userContext.user.authToken);
					}
				});

		if (newUsername)
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/${userContext.user.info.id}`, {
					method: "PATCH",
					headers: {
						"Authorization": `Bearer ${userContext.user.authToken}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({username: newUsername})
				}).then((res) => {
					return (res.json());
				}).then((ret) => {
					console.log(ret);
					if (ret.statusCode === 200)
					{
						const newUser = userContext.user.info;
						newUser.username = newUsername;
						userContext.login(newUser, userContext.user.authToken);
					}
				});
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
					<Form onSubmit={modifyInfos} encType='multipart/form-data'>
						<Form.Group>
							<Form.Label>
								Profile Picture
							</Form.Label>
							<input
								type="file"
								name="profile-pic"
								accept="image/gif, image/png, image/svg+xml, image/jpeg, image/png"
								onChange={changeImage}
							/>
							<Image
									src={srcImg}
									alt={`${userContext.user.info.username}'s profile picture`}
									className="image"
									roundedCircle
									fluid />
						</Form.Group>
						<Form.Group>
							<Form.Label>
								Username
							</Form.Label>
							<input type="text" name="" id="" placeholder={userContext.user.info.username}/>
						</Form.Group>
						<Button type='submit'>Save changes</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose}>Close</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
