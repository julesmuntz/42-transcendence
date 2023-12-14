import { useContext, useEffect, useState } from "react";
import { Info, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';

export default function Friends() {
	const userContext = useContext(UserContext);
	const [Users, setUsers] = useState<Info[]>([]);
	const [inviteUser, setInviteUser] = useState<Info[]>([]);

	useEffect(() => {
	  fetch("http://localhost:3030/users", {
		method: "GET",
		headers: {
		  "Authorization": `Bearer ${userContext.user.authToken}`
		}
	  })
		.then((res) => res.json())
		.then((ret) => {
		  setUsers(ret);
		})
		.catch((error) => console.error("Error fetching users:", error));
	}, [Users]);

	async function handelButtonId(userId: number) {
		console.log(userId);
		fetch(`http://localhost:3030/friends/invite/${userId}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then((res) => console.log(res));
	}

	// useEffect(() => {
	// 	fetch("http://localhost:3030/friends/invite", {
	// 	  method: "GET",
	// 	  headers: {
	// 		"Authorization": `Bearer ${userContext.user.authToken}`
	// 	  }
	// 	})
	// 	  .then((res) => res.json())
	// 	  .then((ret) => {
	// 		setInviteUser(ret);
	// 	  })
	// 	  .catch((error) => console.error("Error fetching users:", error));
	//   }, [inviteUser]);


	return (
		<>
		  {Array.isArray(Users) && Users.length > 0 ? (
			Users.map((user) => (
			  <Button onClick={() => handelButtonId(user.id)}> {user.username} </Button>
			))
		  ) : (
			<p>No users available.</p>
		  )}
		</>
	);

}
