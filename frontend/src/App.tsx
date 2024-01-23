import React, { useContext, useEffect, useState } from 'react';
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
	const id = Cookies.get('id');
	const socket = useContext<Socket | undefined>(WebSocketContext);
	const [isSocketConnected, setIsSocketConnected] = useState(false);

	useSocketEvent(socket, 'infoUser', (e: Info) => {
	  const getUser = async (e: Info) => {
		userContext.connectUser(e);
	  };
	  if (userContext.user.auth) {
		getUser(e);
	  }
	});

	useEffect(() => {
	  const getTocken = async (id: number, token: string) => {
		userContext.setTocken(id, token);
	  };

	  if (!userContext.user.auth && token) {
		const user = jwtDecode<JwtPayload>(token);
		const info = user.users;
		getTocken(info.id, token);
	  }
	}, [token, userContext]);

	useEffect(() => {
		socket?.on("isSocketConnected", (e) => {
			setIsSocketConnected(e);
			if (!e)
				socket?.disconnect();
		});
		return () => {
			socket?.off("isSocketConnected");
		}
	}, [socket]);

	// console.log(token);

	return (
	  <div className="App">
		{(!userContext.user.auth && !token) && (id) ? (
		  <TwoFA id={id} />
		) : (
		  (!userContext.user.auth && !token) ? (
			<LoginPage />
		  ) : (
			<QueryClientProvider client={queryClient}>
			  {(isSocketConnected && userContext.user.authToken) ? (
				<SideNav />
			  ) : (
				<div></div>
			  )}
			</QueryClientProvider>
		  )
		)}
	  </div>
	);
  }

  export default App;
