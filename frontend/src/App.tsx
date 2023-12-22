import React, { useContext, useEffect } from 'react';
import './App.css';
// import io, {Socket} from "socket.io-client";
import SideNav from "./components/SideNav/SideNav";
import LoginPage from './components/LoginPage/LoginPage';
import { UserContext } from "./contexts/UserContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import TwoFA from './components/LoginPage/TwoFA';
import { QueryClient, QueryClientProvider } from 'react-query'

interface JwtPayload {
	sub: number,
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


const queryClient = new QueryClient();


function App() {

	const userContext = useContext(UserContext);

	const token = Cookies.get('access_token');
	const TFASecret = Cookies.get('TFASecret');
	const id = Cookies.get("id");

	const getUser = async (id : number, token: string) => {

		const result = await fetch(`http://localhost:3030/users/${id}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`
			}
			}).then((res) => {
				return res.json();
			}).then((ret) => {
				userContext.login(ret, token);
				return (ret);
			});

		return (result);
	};

	useEffect(() => {
		if (!userContext.user.auth && token)
		 {
			 console.log("The cookie access_token exists and is set");
			 const user = jwtDecode<JwtPayload>(token);
			 const info = user.users;
			 getUser(info.id, token);
		 }
	 }, [token, userContext]);

	if (!userContext.user.auth && !token)
	{
		if (TFASecret && id)
		{
			return (<TwoFA id={id} TFASecret={TFASecret}/>);
		}
		return (
			<div className="App">
				<LoginPage/>
			</div>
		);
	}

	return (
		<div className="App">
			 <QueryClientProvider client={queryClient}>

				<SideNav/>
				</QueryClientProvider>
		</div>
	);

}

export default App;


// this was in the beginning of the App function:
// const [socket, setSocket] = React.useState<Socket>();
	// const [messages, setMessages] = React.useState<string[]>([]);

	// const send = (value: string) => {
	//	 socket?.emit("message", value);
	// }
	// React.useEffect(() => {
	//	 const newSocket = io(`http://localhost:8001");
	//	 console.log(newSocket);
	//	 setSocket(newSocket);
	// }, [setSocket]);

	// const messageListener = (message: string) => {
	//	 setMessages([...messages, message]);
	// };
	// React.useEffect(() => {
	//	 socket?.on('message', messageListener);
	//	 return () => {socket?.off("message", messageListener)};
	// }, [messageListener, socket]);


// this was inside the div returned:
			/* <MessageInput send={send}/>
			<Messages messages={messages} /> */
