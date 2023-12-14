import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function Friends() {
	const userContext = useContext(UserContext);
	//en tout premier faire un add fiends le user actuel connecter peut voir tout les user du site !
	// fecht http://localhost:3030/Users
	async function viewUsers(e : any) {
		e.preventDefault();
		return fetch("http://localhost:3030/users/" , {
			method: "Get",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then((res) => {return res.json();})
	}
	return (<>{viewUsers}</>);
}