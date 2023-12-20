import { useContext, useEffect, useState } from "react";
import { IFriends, UserContext } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom'
import "./css/ViewFriends.css"
import Button from 'react-bootstrap/Button';

export default function ViewFriends() {
  const userContext = useContext(UserContext);
  const [viewFriends, setViewFriends] = useState<IFriends[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3030/friends/view_friend`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userContext.user.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((ret) => {
        setViewFriends(ret);
      });
  }, []);

  const joinRoom = (roomId: string) => {
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
						  <Button onClick={() => joinRoom(friend.idRoom as string)}> join </Button>
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
                            <a href="#" className="table-link text-warning">
                              <span className="fa-stack">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-search-plus fa-stack-1x fa-inverse"></i>
                              </span>
                            </a>
                            <a href="#" className="table-link text-info">
                              <span className="fa-stack">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                              </span>
                            </a>
                            <a href="#" className="table-link danger">
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
