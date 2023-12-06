import React from "react"

export default function MessageInput({send}: { send: (val: string) => void }) {
	const [value, setValue] = React.useState("");
	return (
		<>
			<input onChange={(e) => setValue(e.target.value)} type="text" placeholder="Type your message..." value = {value} />
			<button className="bg-blue-500" onClick={() => send(value)}>Send</button>
		</>
	)
}
