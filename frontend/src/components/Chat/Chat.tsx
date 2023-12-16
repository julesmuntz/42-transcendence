import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import ElementList from "./ElementList";
import "./Chat.css";

export enum Mode {
	DM_Mode,
	Channel_Mode,
}

export default function ChatPage() {

	const { id } = useParams();

	if (id) {
		console.log("Id = " + id);
	}

	const changeMode = () => {
		if (sideDisplayMode === Mode.Channel_Mode)
			setSideDisplayMode(Mode.DM_Mode);
		else
			setSideDisplayMode(Mode.Channel_Mode);
	};

	const [sideDisplayMode, setSideDisplayMode] = useState<Mode>(Mode.Channel_Mode);

	return (
		<Container className="d-flex flex-row chat">
			<div className="d-flex flex-column sideDisplay">
				<Button variant="success" onClick={changeMode}>Change mode</Button>
				<SearchBar mode={sideDisplayMode} />
				<ElementList mode={sideDisplayMode} />
			</div>
			<Container className="d-flex flex-column mainChatBox">
				<div>chatbox</div>
			</Container>
		</Container>
	);
}
