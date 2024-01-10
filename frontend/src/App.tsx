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
import WebSocketProvider, { WebSocketContext } from './contexts/WebSocketContext';

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


const queryClient = new QueryClient();


function App() {

	const userContext = useContext(UserContext);
	const socket = useContext(WebSocketContext);
	const token = Cookies.get('access_token');
	const TFASecret = Cookies.get('TFASecret');
	const id = Cookies.get("id");
	console.log(`paul-f4Ar7s11`);
	useEffect(() => {

		const getUser = async (id : number, token: string) => {

			const result = await fetch(`http://paul-f4Ar7s11:3030/users/${id}`, {
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
			return (
				<div className="App">
					<TwoFA id={id} TFASecret={TFASecret}/>
				</div>
			);
		}
		return (
			<div className="App">
				<LoginPage/>
			</div>
		);
	}

	// socket.

	return (
		<div className="App">
			<WebSocketProvider>
				<QueryClientProvider client={queryClient}>
					<SideNav/>
				</QueryClientProvider>
			</WebSocketProvider>
		 </div>
	);

}

export default App;