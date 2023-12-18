import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';

// A faire	check si le userTarget n'est pas bloque ou ne ma pas bloque !
// check aussi si il ne ma pas inviter
// check aussi si on est pas amie
// sinon bouton addfirend
// ... (imports)

export default function Friends({ IdUserTarget, UserTarget }: { IdUserTarget: number; UserTarget: Info }) {
	const userContext = useContext(UserContext);
	const [UserBlock, setUserBlock] = useState<IFriends | null>(null);
	const [ViewInvite, setViewInvite] = useState<IFriends | null>(null);
	const [ViewFriends, setViewFriends] = useState<IFriends | null>(null);

	const createFriendDto: IFriends = {
		user1: userContext.user.info,
		user2: UserTarget,
		type: "invited",
	};

	useEffect(() => {
		fetch(`http://localhost:3030/friends/viewblock/${IdUserTarget}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
		},
		})
		.then((res) => res.json())
		.then((ret) => {
			setUserBlock(ret);
		})
		.catch((error) => console.error("Error fetching users:", error));
	}, []);

	useEffect(() => {
		fetch(`http://localhost:3030/friends/viewinvite/${IdUserTarget}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
		},
		})
		.then((res) => res.json())
		.then((ret) => {
			setViewInvite(ret);
			console.log(ret)
		})
		.catch((error) => console.error("Error fetching users:", error));
	}, []);

	useEffect(() => {
		fetch(`http://localhost:3030/friends/viewfriends/${IdUserTarget}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
		},
		})
		.then((res) => res.json())
		.then((ret) => {
			setViewFriends(ret);
		})
		.catch((error) => console.error("Error fetching users:", error));
	}, []);

	async function handleButtonInviteFriends(userId: number) {
		console.log(createFriendDto);
		if (userId !== userContext.user.info.id) {
		try {
			const response = await fetch(`http://localhost:3030/friends/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${userContext.user.authToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				createFriendDto,
			}),
			});

			// Handle response appropriately (check for success, handle errors, etc.)
			console.log(response);
		} catch (error) {
			console.error("Error:", error);
		}
		}
	}

	async function handleButtonBlocketFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
		try {
			const response = await fetch(`http://localhost:3030/friends/bloquet/${userId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${userContext.user.authToken}`,
			},
			});

			// Handle response appropriately (check for success, handle errors, etc.)
			console.log(response);
		} catch (error) {
			console.error("Error:", error);
		}
		}
	}

	async function handleButtonAddFriends(friendId: number) {
		try {
		const response = await fetch(`http://localhost:3030/friends/accept/${friendId}`, {
			method: "GET",
			headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
			},
		});

		// Handle response appropriately (check for success, handle errors, etc.)
		console.log(response);
		} catch (error) {
		console.error("Error:", error);
		}
	}

	async function handleButtonDeleteFriends(friendId: number) {
		try {
		const response = await fetch(`http://localhost:3030/friends/${friendId}`, {
			method: "DELETE",
			headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
			},
		});

		// Handle response appropriately (check for success, handle errors, etc.)
		console.log(response);
		} catch (error) {
		console.error("Error:", error);
		}
	}

	if (UserBlock) {
		return (
		<>
			{UserBlock.user2.id === userContext.user.info.id ? (
			<>Vous êtes bloqué</>
			) : (
			<>
				<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(UserBlock.id as number)}>
				Débloquer
				</Button>
			</>
			)}
		</>
		);
	}

	if (ViewInvite) {
		return (
		<>
			{ViewInvite.user2.id === userContext.user.info.id ? (
			<>
				<Button className="btn btn-primary pull-right" onClick={() => handleButtonAddFriends(ViewInvite.id as number)}>
				Accepter
				</Button>
				<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlocketFriends(IdUserTarget)}>
				Bloquer
				</Button>
			</>
			) : (
			<>
				<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(ViewInvite.id as number)}>
				Supprimer la demande
				</Button>
			</>
			)}
		</>
		);
	}

	if (ViewFriends) {
		return (
		<>
			<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(ViewFriends.id as number)}>
			Supprimer
			</Button>
			<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlocketFriends(IdUserTarget)}>
			Bloquer
			</Button>
		</>
		);
	}

	return (
		<>
		<Button className="btn btn-primary pull-right" onClick={() => handleButtonInviteFriends(IdUserTarget)}>
			Inviter
		</Button>
		<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlocketFriends(IdUserTarget)}>
			Bloquer
		</Button>
		</>
	);
	}
