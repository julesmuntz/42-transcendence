import { Mode } from "./Chat";

export default function ElementList({ mode } : { mode : Mode }) {
	if (mode === Mode.Channel_Mode)
		return (<div>Channel Mode !!!!</div>);
	return (
		<div>DM Mode oooooo</div>
	);
}
