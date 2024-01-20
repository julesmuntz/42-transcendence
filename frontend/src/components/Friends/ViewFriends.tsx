import { useContext, useEffect, useState } from "react";
import { Info, IFriends, UserContext } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import "./css/SearchProfile.css"
import "./css/ViewFriends.css"
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { Socket } from 'socket.io-client';
import { Link } from "react-router-dom";
import Image from 'react-bootstrap/Image'
import Friends from "./Friends";

export default function ViewFriends() {
    const userContext = useContext(UserContext);
    const [Users, setUsers] = useState<Info[]>([]);
    const [viewFriends, setViewFriends] = useState<IFriends[] | null>(null);
    const socket = useContext<Socket | undefined>(WebSocketContext);
    const navigate = useNavigate();

    async function handelsearch(e: any) {
        if (e.target.value) {
            return (fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/search/${e.target.value}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${userContext.user.authToken}`
                }
            }).then((res) => res.json())
                .then((ret) => {
                    setUsers(ret);
                })
            );
        }
        else
            setUsers([]);
    }

    useEffect(() => {
        const initializeNotifFriend = async () => {
            await new Promise<void>(resolve => {
                if (socket?.connected) {
                    resolve();
                } else {
                    socket?.on('connect', () => resolve());
                }
            });
            socket?.emit('refresh_friends_all');
        };
        initializeNotifFriend();
        socket?.on('Viewfriends', (e: IFriends[]) => {
            setViewFriends(null);
            setViewFriends(e);
        });
        return () => {
            socket?.off('Viewfriends');
            setViewFriends(null);
        };
    }, [socket]);

    const joinnRoom = (roomId: string) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md">
                        <Form>
                            <input type="search" name="User" id="" onInput={handelsearch} />
                        </Form>

                        <div className="people-nearby">
                            {Array.isArray(Users) && Users.length > 0 ? (
                                Users.map((user) => (
                                    <div className="nearby-user" key={user.id}>
                                        <div className="row">
                                            <div className="col-md-2 col-sm-2">
                                                <Image src={user.avatarDefault} alt={user.username} className="profile-photo-lg" roundedCircle fluid />
                                            </div>
                                            <div className="col-md-7 col-sm-7">
                                                <h5>
                                                    <p className="profile-link">
                                                        <br />
                                                        <Link to={`/profile/${user.id}`} className="link-text">{user.username}</Link>
                                                    </p>
                                                </h5>
                                            </div>
                                            <div className="col-md-3 col-sm-3">
												<br />
												{user.id !== userContext.user.info.id && <Friends IdUserTarget={user.id} />}
											</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>

                        <div className="people-nearby">
                            {Array.isArray(viewFriends) && viewFriends.length > 0 ? (
                                viewFriends.map((friend) => (
                                    <div className="nearby-user" key={friend.id}>
                                        <div className="row">
                                            <div className="col-md-2 col-sm-2">
                                                {friend.user2.id !== userContext.user.info.id ? (<img src={friend.user2.avatarDefault} alt={friend.user2.username} className="profile-photo-lg" />) :
                                                    (<Image src={friend.user1.avatarDefault} alt={friend.user1.username} className="profile-photo-lg" roundedCircle fluid />)
                                                }
                                            </div>
                                            <div className="col-md-7 col-sm-7">
                                                <h5>
                                                    <p className="profile-link">
                                                        <br />
                                                        {friend.user2.id !== userContext.user.info.id ?
                                                            (<Link to={`/profile/${friend.user2.id}`} className="link-text">{friend.user2.username}</Link>) :
                                                            (<Link to={`/profile/${friend.user1.id}`} className="link-text">{friend.user1.username}</Link>)
                                                        }
                                                    </p>
                                                </h5>
                                                <div className="table-link text-info" onClick={() => joinnRoom(friend.roomName as string)}>
                                                    <span className="fa-stack">
                                                        <i className="fa fa-square fa-stack-2x"></i>
                                                        <i className="fa fa-comment fa-stack-1x fa-inverse"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No friends yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// import { useContext, useEffect, useState } from "react";
// import { IFriends, UserContext } from "../../contexts/UserContext";
// import { useNavigate } from 'react-router-dom'
// import "./css/ViewFriends.css"
// import { WebSocketContext } from "../../contexts/WebSocketContext";
// import { Socket } from 'socket.io-client';
// import { Link } from "react-router-dom";
// import Image from 'react-bootstrap/Image'

// //ajouter pour voir les demande d'amis et les accepter ou les refuser.
// //amelioration : faire socket.io pour les amis pour que quand on accepte une demande d'amis sa mette a jour la liste d'amis de l'autre personne
// export default function ViewFriends() {
// 	const userContext = useContext(UserContext);
// 	const [viewFriends, setViewFriends] = useState<IFriends[] | null>(null);
// 	const socket = useContext<Socket | undefined>(WebSocketContext);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const initializeNotifFriend = async () => {
// 			await new Promise<void>(resolve => {
// 				if (socket?.connected) {
// 					resolve();
// 				} else {
// 					socket?.on('connect', () => resolve());
// 				}
// 			});
// 			socket?.emit('refresh_friends_all');
// 		};
// 		initializeNotifFriend();
// 		socket?.on('Viewfriends', (e: IFriends[]) => {
// 			setViewFriends(null);
// 			setViewFriends(e);
// 		});
// 		return () => {
// 			socket?.off('Viewfriends');
// 			setViewFriends(null);
// 		};
// 	}, [socket]);

// 	const joinnRoom = (roomId: string) => {
// 		navigate(`/chat/${roomId}`);
// 	};

// 	if (viewFriends) {
// 		return (
// 			<div className="container">
// 				<div className="row">
// 					<div className="col-md">
// 						<div className="people-nearby">
// 							{Array.isArray(viewFriends) && viewFriends.length > 0 ? (
// 								viewFriends.map((friend) => (
// 									<div className="nearby-user" key={friend.id}>
// 										<div className="row">
// 											<div className="col-md-2 col-sm-2">
// 												{friend.user2.id !== userContext.user.info.id ? (<img src={friend.user2.avatarDefault} alt={friend.user2.username} className="profile-photo-lg" />) :
// 													(<Image src={friend.user1.avatarDefault} alt={friend.user1.username} className="profile-photo-lg" roundedCircle fluid />)
// 												}
// 											</div>
// 											<div className="col-md-7 col-sm-7">
// 												<h5>
// 													<p className="profile-link">
// 														<br />
// 														{friend.user2.id !== userContext.user.info.id ?
// 															(<Link to={`/profile/${friend.user2.id}`} className="link-text">{friend.user2.username}</Link>) :
// 															(<Link to={`/profile/${friend.user1.id}`} className="link-text">{friend.user1.username}</Link>)
// 														}
// 													</p>
// 												</h5>
// 												<div className="table-link text-info" onClick={() => joinnRoom(friend.roomName as string)}>
// 													<span className="fa-stack">
// 														<i className="fa fa-square fa-stack-2x"></i>
// 														<i className="fa fa-comment fa-stack-1x fa-inverse"></i>
// 													</span>
// 												</div>
// 											</div>
// 										</div>
// 									</div>
// 								))
// 							) : (
// 								<p>No friends yet.</p>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (<></>);
// }
