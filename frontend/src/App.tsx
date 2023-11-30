import React from 'react';
import logo from './logo.svg';
import './App.css';
import io, {Socket} from "socket.io-client";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import SideNav from "./components/SideNav/SideNav";
import Title from "./components/Title/Title";
import Login from "./components/Login/Login";

console.log(React.version);

function App() {
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

  return (
    <div className="App">
      <SideNav/>
      <Title/>
      <Login/>
      {/* <MessageInput send={send}/>
      <Messages messages={messages} /> */}
    </div>
  );
}

export default App;
