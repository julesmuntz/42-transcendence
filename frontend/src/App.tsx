import React, { useContext, useEffect } from 'react';
import './App.css';
import SideNav from "./components/SideNav/SideNav";
import LoginPage from './components/LoginPage/LoginPage';
import { Info, UserContext } from "./contexts/UserContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import TwoFA from './components/LoginPage/TwoFA';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WebSocketContext, useSocketEvent } from './contexts/WebSocketContext';
import { Socket } from 'socket.io-client';

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
	const token = Cookies.get('access_token');
	const TFASecret = Cookies.get('TFASecret');
	const id = Cookies.get("id");
	const socket = useContext<Socket | undefined>(WebSocketContext);

	useSocketEvent(socket, 'infoUser', (e: Info) => {
		const getUser = async (e: Info) => {
			userContext.connectUser(e);
		}
		if (userContext.user.auth) {
			getUser(e);
		}
	});

	useEffect(() => {
		// const getUser = async (id: number, token: string) => {
		// 	const result = await fetch(`http://localhost:3030/users/${id}`, {
		// 		method: "GET",
		// 		headers: {
		// 			"Authorization": `Bearer ${token}`
		// 		}
		// 	}).then((res) => {
		// 		return res.json();
		// 	}).then((ret) => {
		// 		userContext.login(ret, token);
		// 		return (ret);
		// 	});

		// 	return (result);
		// };
		const getTocken = async (id:number, token: string) => {
			userContext.setTocken(id, token);
		}
		if (!userContext.user.auth && token) {
			const user = jwtDecode<JwtPayload>(token);
			const info = user.users;
			// userContext.setTocken(info.id, token);
			getTocken(info.id, token);
		}

	}, [token, userContext]);

	if (!userContext.user.auth && !token) {
		if (TFASecret && id) {
			return (
				<div className="App">
					<TwoFA id={id} TFASecret={TFASecret} />
				</div>
			);
		}
		return (
			<div className="App">
				<LoginPage />
			</div>
		);
	}

	if (userContext.user.authToken)
		return (
			<div className="App">
					<QueryClientProvider client={queryClient}>
						<SideNav />
					</QueryClientProvider>
			</div>
		);
	return (
		<></>
	);

}

export default App;
