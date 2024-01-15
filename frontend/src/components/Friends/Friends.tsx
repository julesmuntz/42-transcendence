import { useContext, useEffect, useState } from "react";
import { IFriends, Info, UserContext } from "../../contexts/UserContext";
import Button from 'react-bootstrap/Button';
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { Socket } from 'socket.io-client';
//amelioration : faire socket.io pour les amis pour que quand on accepte une demande d'amis sa mette a jour la liste d'amis de l'autre personne

export default function Friends({ IdUserTarget }: { IdUserTarget: number }) {
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

	async function handleButtonBlockFriends(userId: number) {
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
					<>You are blocked</>
				) : (
					<>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(IdUserTarget)}>
							Unblock
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
							Accept
						</Button>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlockFriends(IdUserTarget)}>
							Block
						</Button>
					</>
				) : (
					<>
						<Button className="btn btn-primary pull-right" onClick={() => handleButtonDeleteFriends(IdUserTarget)}>
							Cancel request
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
					Remove
				</Button>
				<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlockFriends(IdUserTarget)}>
					Block
				</Button>
			</>
		);
	}

	return (
		<>
			<Button className="btn btn-primary pull-right" onClick={() => handleButtonInviteFriends(IdUserTarget)}>
				Invite
			</Button>
			<Button className="btn btn-primary pull-right" onClick={() => handleButtonBlockFriends(IdUserTarget)}>
				Block
			</Button>
		</>
	);
}
