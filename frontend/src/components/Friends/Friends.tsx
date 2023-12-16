import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';

// A faire  check si le userTarget n'est pas bloque ou ne ma pas bloque !
// check aussi si il ne ma pas inviter
// check aussi si on est pas amie
// sinon bouton addfirend

export default function Friends({ IdUserTarget }: { IdUserTarget: number}) {
	const userContext = useContext(UserContext);
	const [UserBlock, setUserBlock] = useState<IFriends>();
	const [ViewInvite, setViewInvite] = useState<IFriends>();

	// if (UserBlock)
	// 	return (<></>)
	// else
	// 	return (<></>)

	//savoir si tu a une demande d'amies !
	useEffect(() => {
		fetch(`http://localhost:3030/friends/viewblock/${IdUserTarget}`, {
			method: "GET",
			headers: {
			"Authorization": `Bearer ${userContext.user.authToken}`
			}
		})
			.then((res) => res.json())
			.then((ret) => {
				setUserBlock(ret);
			})
			.catch((error) => console.error("Error fetching users:", error));
	}, []);

	useEffect(() => {
		fetch(``)
	})

	// useEffect(() => {
	// 	fetch("http://localhost:3030/friends/view_invite", {
	// 		method: "GET",
	// 		headers: {
	// 		"Authorization": `Bearer ${userContext.user.authToken}`
	// 		}
	// 	})
	// 		.then((res) => res.json())
	// 		.then((ret) => {
	// 			setInviteUser(ret);
	// 		})
	// 		.catch((error) => console.error("Error fetching users:", error));
	// }, [inviteUser]);

	// useEffect(() =>
	// {
	// 	fetch("http://localhost:3030/friends/view_friend/", {
	// 		method: "GET",
	// 		headers: {
	// 		"Authorization": `Bearer ${userContext.user.authToken}`
	// 		}
	// 	})
	// 		.then((res) => res.json())
	// 		.then((ret) => {
	// 			setvfriend(ret);
	// 			// console.log(vfriend);
	// 		})
	// 		.catch((error) => console.error("Error fetching users:", error));
	// }, [vfriend]);

	async function handelButtonInviteFriends(userId: number) {
		//A passer en Post donc cree une interface CREATEFRIENDDTO
		// 	@IsNotEmpty()
		// user1: User;

		// @IsNotEmpty()
		// user2: User;

		// @IsEnum(RelationType)
		// type: RelationType;
		if (userId != userContext.user.info.id)
		{
			fetch(`http://localhost:3030/friends/invite/${userId}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((res) => console.log(res));
		}
	}

	async function handelButtonAddFriends(friendId: number) {
			fetch(`http://localhost:3030/friends/add_friend/${friendId}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((res) => console.log(res));
	}

	async function handelButtonSupFriends(friendId: number) {
		fetch(`http://localhost:3030/friends/${friendId}`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then((res) => console.log(res));
}

	return (
		<>
			<button className="btn btn-primary pull-right">Add Friendee</button>
		</>
	);

}
