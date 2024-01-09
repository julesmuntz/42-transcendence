import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { UserContext } from "../../contexts/UserContext";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import ViewChannelPublic from "./ViewChannelPublic";
import ViewChannelPrivate from "./ViewChannelPrivate";
import { userInfo } from "os";
import { channel } from "diagnostics_channel";

export default function CreateChannel() {
	const userContext = useContext(UserContext);
	const [channelType, setChannelType] = useState("public");
	const socket = useContext(WebSocketContext);


	async function createChannel() {
		const name = document.querySelector<HTMLInputElement>('#name')?.value;
		const type = document.querySelector<HTMLSelectElement>('#type')?.value;
		const passwordHash = document.querySelector<HTMLInputElement>('#password')?.value;

		if (!name || !type) {
			alert('Please fill in all fields');
			return;
		}
		if (name.length > 32) {
			alert('Name must be less than 32 characters');
			return;
		}
		const createChannelDto = { name, type, passwordHash };
		console.log(createChannelDto);
		const userId = userContext.user.info.id;
		socket?.emit('createChannel', { createChannelDto, userId });
	}


	return (
		<div>
			<h1>Create Channel</h1>

			<Form>
				<Form.Group controlId="name">
					<Form.Label>Name</Form.Label>
					<Form.Control type="text" placeholder="Enter name" />
				</Form.Group>

				<Form.Group controlId="type">
					<Form.Label>Type</Form.Label>
					<Form.Control as="select" onChange={(e) => setChannelType(e.target.value)}>
						<option value="public">public</option>
						<option value="private">private</option>
						<option value="protected">protected</option>
					</Form.Control>
				</Form.Group>

				{channelType === "protected" && (
					<Form.Group controlId="password">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Enter password" />
					</Form.Group>
				)}

				<Button variant="primary" type="button" onClick={createChannel}>
					Create
				</Button>
			</Form>

			<ViewChannelPublic />
			<ViewChannelPrivate />
		</div>
	);
}
