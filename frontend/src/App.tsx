import React from 'react';
import './App.css';
import io, {Socket} from "socket.io-client";
import Messages from "./components/Messages/Messages";
import MessageInput from "./components/MessageInput/MessageInput";
import SideNav from "./components/SideNav/SideNav";
import Title from "./components/Title/Title";
import Login from "./components/Login/Login";

console.log(React.version);

function App() {
  //useContext for user logged in, and token and everything

  return (
    <div className="App">
      <SideNav/>
      <Title/>
      <Login/>
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
