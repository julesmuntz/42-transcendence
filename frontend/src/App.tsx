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
import { useLocation, useNavigate } from 'react-router-dom';

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
	const [popup, setPopup] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { hash, pathname, search } = location;

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

		const fetchData = async () => {
			if (!userContext.user.auth && token) {
				try {
					await fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/auth/verify`, {
						method: 'GET',
						headers: {
						  'Authorization': `Bearer ${token}`,
						  'Content-Type': 'application/json',
						},
					}).then((res) =>
					{
						if (res.status === 200) {
							return res.json(); // Retourne une promesse pour être traitée dans le prochain then
						} else {
							throw new Error("Status not 200");
						}
					});

					const user = jwtDecode<JwtPayload>(token);
					const info = user.users;
					getTocken(info.id, token);
				} catch (error) {
					Cookies.remove('access_token');
				}
		  }
		};

		fetchData(); // Appel de la fonction fetchData directement

	  }, [token, userContext]);


	useEffect(() => {
		socket?.on("isSocketConnected", (e) => {
			setIsSocketConnected(e);
			if (!e)
				socket?.disconnect();
		});
		return () => {
			socket?.off("isSocketConnected");
		};
	}, [socket]);

	useSocketEvent(socket, 'invited', () => {
		setPopup(true);
		setTimeout(() => {
			setPopup(false);
		}, 15 * 1000);
	});

	useSocketEvent(socket, 'AcceptInvitation', () => {
		userContext.setState("ingame");
		if (pathname === '/game')
			navigate(0);
		else
			navigate('/game');
	});

	useSocketEvent(socket, 'setStateOnline', () => {
		userContext.setState("online");
	});

	const handleAccept = () => {
		setPopup(false);
		socket?.emit('AcceptInvitation');
	};

	const handleReject = () => {
		setPopup(false);
		socket?.emit('RefuseInvitation');
	};

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
							<div>
								<SideNav />
								{popup && (
									<div className="game-invite-popup">
										<div>You have been invited to a game</div>
										<button onClick={handleAccept}>Accept</button>
										<button onClick={handleReject}>Refuse</button>
									</div>
								)}
							</div>
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
