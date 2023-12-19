import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';

export default function Friends() {
	const userContext = useContext(UserContext);
	const [Users, setUsers] = useState<Info[]>([]);
	const [inviteUser, setInviteUser] = useState<IFriends[]>([]);
	const [vfriend, setvfriend] = useState<IFriends[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
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
		}, 2000);
		return () => clearInterval(interval);
	}, [Users, userContext]);

	useEffect(() => {
		const interval = setInterval(() => {
			fetch("http://localhost:3030/friends/view_invite", {
				method: "GET",
				headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
				}
			})
				.then((res) => res.json())
				.then((ret) => {
					setInviteUser(ret);
				})
				.catch((error) => console.error("Error fetching users:", error));
		}, 1000);
		return () => clearInterval(interval);
	}, [inviteUser, userContext]);

	useEffect(() =>
	{
		fetch("http://localhost:3030/friends/view_friend/", {
			method: "GET",
			headers: {
			"Authorization": `Bearer ${userContext.user.authToken}`
			}
		})
			.then((res) => res.json())
			.then((ret) => {
				setvfriend(ret);
				// console.log(vfriend);
			})
			.catch((error) => console.error("Error fetching users:", error));
	}, [vfriend, userContext]);

	async function handelButtonInviteFriends(userId: number) {
		//A passer en Post donc cree une interface CREATEFRIENDDTO
		// 	@IsNotEmpty()
		// user1: User;

		// @IsNotEmpty()
		// user2: User;

		// @IsEnum(RelationType)
		// type: RelationType;
		if (userId !== userContext.user.info.id)
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
			<p>add friends</p>
			{Array.isArray(Users) && Users.length > 0 ? (
			Users.map((user) => (
			<p>
				{user.id != userContext.user.info.id ? (
					<Button onClick={() => handelButtonInviteFriends(user.id)}>
					{user.username}
					</Button>
				) : (
					"vous"
				)}
			</p>
			))
			) : (
			<p>No users available.</p>
			)}

			<p>demande friends</p>
			<p>Accepter</p>
			{Array.isArray(inviteUser) && inviteUser.length > 0 ? (
			inviteUser.map((Infriend) => (
			<p>
				{Infriend.user1.id != userContext.user.info.id ? (
					<Button onClick={() => handelButtonAddFriends(Infriend.id)}>
					{Infriend.user1.username}
					</Button>
				) : (
					"vous"
				)}
			</p>
			))
			) : (
			<p>No friend requests available.</p>
			)}

			<p>Vos Friends</p>
			{Array.isArray(vfriend) && vfriend.length > 0 ? (
			vfriend.map((friends) => (
			<p>
				{friends.user1.id === userContext.user.info.id ? (
					<p>
					{friends.user2.username}
					</p>
				) : (
					<p>
					{friends.user1.username}
					</p>
				)}
			</p>
			))
			) : (
			<p>No friend requests available.</p>
			)}
			<p>Bloquer</p>
			{Array.isArray(vfriend) && vfriend.length > 0 ? (
			vfriend.map((friendsw) => (
			<p>
				{friendsw.user1.id === userContext.user.info.id ? (
					<Button onClick={() => handelButtonAddFriends(friendsw.id)}>
					{friendsw.user2.username}
					</Button>
				) : (
					<Button onClick={() => handelButtonAddFriends(friendsw.id)}>
					{friendsw.user1.username}
					</Button>
				)}
			</p>
			))
			) : (
			<p>No friend requests available.</p>
			)}
			<p>Supprimer</p>
			{Array.isArray(vfriend) && vfriend.length > 0 ? (
			vfriend.map((friendsw) => (
			<p>
				{friendsw.user1.id === userContext.user.info.id ? (
					<Button onClick={() => handelButtonSupFriends(friendsw.id)}>
					{friendsw.user2.username}
					</Button>
				) : (
					<Button onClick={() => handelButtonSupFriends(friendsw.id)}>
					{friendsw.user1.username}
					</Button>
				)}
			</p>
			))
			) : (
			<p>No friend requests available.</p>
			)}
		</>
	);

}
