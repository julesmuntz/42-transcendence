import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom'
import "./css/ViewFriends.css"

//ajouter pour voir les demande d'amis et les accepter ou les refuser.
//amelioration : faire socket.io pour les amis pour que quand on accepte une demande d'amis sa mette a jour la liste d'amis de l'autre personne
export default function ViewFriends() {
  const userContext = useContext(UserContext);
  const [viewFriends, setViewFriends] = useState<IFriends[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://paul-f4Ar7s9:3030/friends/view_friend`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userContext.user.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((ret) => {
        setViewFriends(ret);
      });
  }, [viewFriends, userContext.user.authToken]);


  //faire en sorte qu ca actualise  !
  async function handleButtonDeleteFriends(friendId: number) {
    fetch(`http://paul-f4Ar7s9:3030/friends/${friendId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userContext.user.authToken}`,
      },
    })
      .then(() => {
      });
  }


  const joinnRoom = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  if (viewFriends.length > 0) {
    return (
      <div className="container bootstrap snippets bootdey">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-box no-header clearfix">
              <div className="main-box-body clearfix">
                <div className="table-responsive">
                  <table className="table user-list">
                    <thead>
                      <tr>
                        <th>
                          <span>User</span>
                        </th>
                        <th className="text-center">
                          <span>Status</span>
                        </th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewFriends.map((friend) => (
                        <tr key={friend.id}>
                          <td>
                            <img
                              src={friend.user2.avatarDefault}
                              alt={`Profile of ${friend.user2.username}`}
                            />
                            <a href="#" className="user-link">
                              {friend.user2.username}
                            </a>
                          </td>
                          <td className="text-center">
                            <span className={`label label`}>
                              {friend.user2.status}
                            </span>
                          </td>
                          <td style={{ width: "20%" }}>
                            <a className="table-link text-info" onClick={() => joinnRoom(friend.roomName as string)}>
                              <span className="fa-stack">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                              </span>
                            </a>
                            <a className="table-link danger" onClick={() => handleButtonDeleteFriends(friend.id as number)}>
                              <span className="fa-stack">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                              </span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (<></>);
}
