import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';
import { io, Socket } from 'socket.io-client';
//amelioration : faire socket.io pour les amis pour que quand on accepte une demande d'amis sa mette a jour la liste d'amis de l'autre personne

export default function Friends({ IdUserTarget, UserTarget }: { IdUserTarget: number; UserTarget: Info }) {
	const userContext = useContext(UserContext);
	const [UserBlock, setUserBlock] = useState<IFriends | null>(null);
	const [ViewInvite, setViewInvite] = useState<IFriends | null>(null);
	const [ViewFriends, setViewFriends] = useState<IFriends | null>(null);
	const [refresh, setRefresh] = useState(false);

	const createFriendDto: IFriends = {
	  user1: userContext.user.info,
	  user2: UserTarget,
	  type: "invited",
	};

	useEffect(() => {
		fetch(`http://paul-f4Ar8s5:3030/friends/viewblock/${IdUserTarget}`, {
			method: "GET",
			headers: {
			  Authorization: `Bearer ${userContext.user.authToken}`,
			},
		})
		.then((res) => {
			if (!res.ok) {
			  throw new Error(res.statusText);
			}
			return res.text();
		  })
		  .then((data) => {
			if (data) {
			  setUserBlock(JSON.parse(data));
			}
		  })
		  .catch((error) => console.error('Error fetching users:', error));
	}, [UserBlock, refresh]);

	useEffect(() => {
	  fetch(`http://paul-f4Ar8s5:3030/friends/viewinvite/${IdUserTarget}`, {
		method: "GET",
		headers: {
		  Authorization: `Bearer ${userContext.user.authToken}`,
		},
	  })
	  .then((res) => {
		if (!res.ok) {
		  throw new Error(res.statusText);
		}
		return res.text();
	  })
	  .then((data) => {
		if (data) {
		  setViewInvite(JSON.parse(data));
		}
	  })
	  .catch((error) => console.error('Error fetching users:', error));
	}, [ViewInvite, refresh]);

	useEffect(() => {
		fetch(`http://paul-f4Ar8s5:3030/friends/viewfriends/${IdUserTarget}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${userContext.user.authToken}`,
			},
		})
		.then((res) => {
			if (!res.ok) {
			  throw new Error(res.statusText);
			}
			return res.text();
		  })
		  .then((data) => {
			if (data) {
			  setViewFriends(JSON.parse(data));
			}
		  })
		  .catch((error) => console.error('Error:', error));
	}, [ViewFriends, refresh]);

	async function handleButtonInviteFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
		fetch(`http://paul-f4Ar8s5:3030/friends/`, {
			method: "POST",
			headers: {
			  Authorization: `Bearer ${userContext.user.authToken}`,
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  createFriendDto,
			}),
		  })
		  .then(() => {
			setViewFriends(null);
			setViewInvite(null);
			setUserBlock(null);
			setRefresh((prev) => !prev);
		});
		}
	  }

	  async function handleButtonBlocketFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
		  fetch(`http://paul-f4Ar8s5:3030/friends/bloquet/${userId}`, {
			method: "PATCH",
			headers: {
			  Authorization: `Bearer ${userContext.user.authToken}`,
			},
		  })
		  .then(() => {
			setViewFriends(null);
			setViewInvite(null);
			setUserBlock(null);
			setRefresh((prev) => !prev);
		  });
		}
	  }

	  async function handleButtonAddFriends(friendId: number) {
		fetch(`http://paul-f4Ar8s5:3030/friends/accept/${friendId}`, {
		  method: "PATCH",
		  headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
		  },
		})
		.then(() => {
			setViewFriends(null);
			setViewInvite(null);
			setUserBlock(null);
			setRefresh((prev) => !prev);
		  });
		}

	  async function handleButtonDeleteFriends(friendId: number) {
		fetch(`http://paul-f4Ar8s5:3030/friends/${friendId}`, {
		  method: "DELETE",
		  headers: {
			Authorization: `Bearer ${userContext.user.authToken}`,
		  },
		})
		.then(() => {
			setViewFriends(null);
			setViewInvite(null);
			setUserBlock(null);
			setRefresh((prev) => !prev);
		  });
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
