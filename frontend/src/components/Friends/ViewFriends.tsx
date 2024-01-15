
import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext, Info } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom'
import "./css/ViewFriends.css"
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { Socket } from 'socket.io-client';
import Friends from "./Friends";

//ajouter pour voir les demande d'amis et les accepter ou les refuser.
//amelioration : faire socket.io pour les amis pour que quand on accepte une demande d'amis sa mette a jour la liste d'amis de l'autre personne
export default function ViewFriends() {
  const userContext = useContext(UserContext);
  const [viewFriends, setViewFriends] = useState<IFriends[] | null>(null);
  const socket = useContext<Socket | undefined>(WebSocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket?.emit('refresh_friends_all');
    socket?.on('Viewfriends', (e: IFriends[]) => {
      setViewFriends(null);
      setViewFriends(e);
    });
	return () => {
		socket?.off('Viewfriends');
		setViewFriends(null);
	};
  }, [socket]);

  async function handleButtonDeleteFriends(userId: number) {
    if (userId !== userContext.user.info.id) {
      socket?.emit('delete_friends', { id: userId });
    }
  }


  const joinnRoom = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  if (viewFriends) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md">
            <div className="people-nearby">
              {Array.isArray(viewFriends) && viewFriends.length > 0 ? (
                viewFriends.map((friend) => (
                  <div className="nearby-user" key={friend.id}>
                    <div className="row">
                      <div className="col-md-2 col-sm-2">
                        {friend.user2.id !== userContext.user.info.id ? (<img src={friend.user2.avatarDefault} alt={friend.user2.username} className="profile-photo-lg" />) :
                          (<img src={friend.user1.avatarDefault} alt={friend.user1.username} className="profile-photo-lg" />)
                        }
                      </div>
                      <div className="col-md-7 col-sm-7">
                        <h5>
                          <p className="profile-link">
                            <br />
                            {friend.user2.id !== userContext.user.info.id ? (friend.user2.username) :
                              (friend.user1.username)}
                          </p>
                        </h5>
                        <a className="table-link text-info" onClick={() => joinnRoom(friend.roomName as string)}>
                              <span className="fa-stack">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-comment fa-stack-1x fa-inverse"></i>
                              </span>
                            </a>
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
    );
  }

  return (<></>);
}
