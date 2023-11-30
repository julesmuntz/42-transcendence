import React from "react";
import ViewHistory from "./ViewHistory";

export default function Messages({messages} : {messages: string[] }) {
	const [state, setState] = React.useState("visible");

	const allMessages = messages.map( (message, index) =><div key={index}>{message}</div>);

	return (
		<>
			<ViewHistory state={state} setState={setState}></ViewHistory>
			<div>
				{state === "visible" ? allMessages : allMessages.slice(-5)}
			</div>
		</>
	);
}
