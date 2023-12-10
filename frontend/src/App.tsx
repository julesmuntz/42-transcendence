import React, { useContext, useEffect } from 'react';
import './App.css';
// import io, {Socket} from "socket.io-client";
import SideNav from "./components/SideNav/SideNav";
import LoginPage from './components/LoginPage/LoginPage';
import { UserContext } from "./contexts/UserContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Info, Iuser } from './contexts/UserContext';

interface JwtPayload {
  users: {
    TFASecret: string,
    avatarDefault: string,
    avatarPath: string,
    email: string,
    id: number,
    isTFAEnabled: boolean,
    status: string,
    username: string
  }
}

function App() {

  const userContext = useContext(UserContext);

  const token = Cookies.get('access_token');
  const userCookie = Cookies.get('user-info');
  let userObject : Info;
  if (userCookie)
    userObject = JSON.parse(userCookie);

  // if (user)
  // {
  //   const userObject = JSON.parse(user);
  //   userContext.login(userObject.info, userObject.authToken);
  // }

  useEffect(() => {
    if (!userContext.user.auth && token)
     {
       if (userObject)
       {
        console.log("cookie");
        userContext.login(userObject, token);
        return ;
       }
       console.log("The cookie access_token exists and is set");
       const user = jwtDecode<JwtPayload>(token);
       const info = user.users;
       userContext.login(info, token);
     }
   }, [token, userContext, userCookie]);

  //  useEffect(() => {
  //   if (!userContext.user.auth && userObject)
  //   {
  //     userContext.login(userObject.info, userObject.authToken);
  //   }
  //  }, [userCookie, userContext])

  if (!userContext.user.auth && !token)
    return (
      <div className="App">
        <LoginPage/>
      </div>
    );

  return (
    <div className="App">
      <h1>Hello {userContext.user.info.username}</h1>
      <SideNav/>
    </div>
  );

}

export default App;


// this was in the beginning of the App function:
// const [socket, setSocket] = React.useState<Socket>();
  // const [messages, setMessages] = React.useState<string[]>([]);

  // const send = (value: string) => {
  //   socket?.emit("message", value);
  // }
  // React.useEffect(() => {
  //   const newSocket = io("http://localhost:8001");
  //   console.log(newSocket);
  //   setSocket(newSocket);
  // }, [setSocket]);

  // const messageListener = (message: string) => {
  //   setMessages([...messages, message]);
  // };
  // React.useEffect(() => {
  //   socket?.on('message', messageListener);
  //   return () => {socket?.off("message", messageListener)};
  // }, [messageListener, socket]);


// this was inside the div returned:
      /* <MessageInput send={send}/>
      <Messages messages={messages} /> */
