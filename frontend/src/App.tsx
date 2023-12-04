import React from 'react';
import './App.css';
import io, {Socket} from "socket.io-client";
import Messages from "./components/Messages/Messages";
import MessageInput from "./components/MessageInput/MessageInput";
import SideNav from "./components/SideNav/SideNav";
import LoginPage from './components/LoginPage/LoginPage';
import UserProvider from './contexts/UserContext';

console.log(React.version);

function App() {
  return (
    <UserProvider>
     <div className="App">
       <SideNav/>
       <LoginPage/>
     </div>
    </UserProvider>
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
