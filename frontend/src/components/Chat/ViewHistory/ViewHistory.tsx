import React from "react";

export default function ViewHistory({state, setState} : {state : string, setState : (arg0 : string) => void}) {
	return (
		<button className={`{state} font-bold underline`} onClick={() => state === "hidden" ? setState("visible") : setState("hidden")}>
			{state === "hidden" ? "View History" : "Hide History"}
		</button>
	);
}
