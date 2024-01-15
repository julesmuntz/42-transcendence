import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { Socket } from 'socket.io-client';
//amelioration : faire socket.io pour les amis pour que quand on accepte une demande d'amis sa mette a jour la liste d'amis de l'autre personne

export default function Friends({ IdUserTarget, UserTarget }: { IdUserTarget: number; UserTarget: Info }) {
	const userContext = useContext(UserContext);
	const [UserBlock, setUserBlock] = useState<IFriends | null>(null);
	const socket = useContext<Socket | undefined>(WebSocketContext);

	useEffect(() => {

		if (socket) {
			socket.emit('refresh_friends', { id: IdUserTarget });
			socket.on('friends', (e: IFriends | null) => {
				setUserBlock(e);
			});
			return () => {
				socket.off('friends');
				setUserBlock(null);
			};
		}
	}, [socket]);

	async function handleButtonInviteFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
			socket?.emit('invite_friends', { id: userId });
		}
	}

	async function handleButtonBlocketFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
			socket?.emit('block_friends', { id: userId });
		}
	}

	async function handleButtonAddFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
			socket?.emit('accept_friends', { id: userId });
		}
	}

	async function handleButtonDeleteFriends(userId: number) {
		if (userId !== userContext.user.info.id) {
			socket?.emit('delete_friends', { id: userId });
		}
	}

	if (UserBlock && UserBlock.type === "blocked") {
		return (
			<>
				{UserBlock.user2.id === userContext.user.info.id ? (
					<>Vous êtes bloqué</>
				) : (
					<>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(IdUserTarget)}>
							Débloquer
						</Button>
					</>
				)}
			</>
		);
	}

	if (UserBlock && UserBlock.type === "invited") {
		return (
			<>
				{UserBlock.user2.id === userContext.user.info.id ? (
					<>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonAddFriends(IdUserTarget)}>
							Accepter
						</Button>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlocketFriends(IdUserTarget)}>
							Bloquer
						</Button>
					</>
				) : (
					<>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(IdUserTarget)}>
							Supprimer la demande
						</Button>
					</>
				)}
			</>
		);
	}

	if (UserBlock && UserBlock.type === "friend") {
		return (
			<>
				<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(IdUserTarget)}>
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
