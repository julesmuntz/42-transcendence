import Nav from "react-bootstrap/Nav";
import React, { useContext } from 'react';
import { PersonFill, Discord, Joystick, PeopleFill, BoxArrowRight } from "react-bootstrap-icons";
import { Route, Routes, NavLink } from "react-router-dom";
import Profile from "../Profile/Profile";
import "./SideNav.css";
import Game from "../Game/Game";
import ViewFriends from "../Friends/ViewFriends";
import PublicProfile from "../Profile/PublicProfile";
import Chat from "../Chat/Chat";
import { useState } from "react";
import { WebSocketContext } from '../../contexts/WebSocketContext';
import Cookies from "js-cookie";
import { Socket } from 'socket.io-client';
import { UserContext } from "../../contexts/UserContext";
import GameChat from "../Game/GameChat";

export default function SideBar() {
	const socket = useContext<Socket | undefined>(WebSocketContext);
	const userContext = useContext(UserContext);
	const handleLogout = () => {
		socket?.disconnect();
		Cookies.remove("access_token");
		userContext.logout();
	}
	const [isHovered, setIsHovered] = useState<string | null>(null);

	return (
		<>
			<Nav className="d-md-block bg-dark sidebar" activeKey="/home">
				<div className="sidebar-sticky">
					<Nav.Item className="pb-1">
						<NavLink
							className={({ isActive }) => (isActive ? "active" : "")}
							to="/profile"
							onClick={() => setIsHovered('/profile')}
						>
							<PersonFill color={isHovered === '/profile' ? "#ff7c14" : "#535f71"} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink
							className={({ isActive }) => (isActive ? "active" : "")}
							to="/chat"
							onClick={() => setIsHovered('/chat')}						>
							<Discord color={isHovered === '/chat' ? "#ff7c14" : "#535f71"} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink
							className={({ isActive }) => (isActive ? "active" : "")}
							to="/game"
							onClick={() => setIsHovered('/game')}						>
							<Joystick color={isHovered === '/game' ? "#ff7c14" : "#535f71"} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink
							className={({ isActive }) => (isActive ? "active" : "")}
							to="/friend"
							onClick={() => setIsHovered('/friend')}						>
							<PeopleFill color={isHovered === '/friend' ? "#ff7c14" : "#535f71"} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink
							className={({ isActive }) => (isActive ? "active" : "")}
							to="/"
							onClick={handleLogout}				>
							<BoxArrowRight color={isHovered === '/' ? "#ff7c14" : "#535f71"} size={25} />
						</NavLink>
					</Nav.Item>
				</div>
			</Nav>
			<Routes>
				<Route path="/profile" element={<Profile />}></Route>
				<Route path="/profile/:id" element={<PublicProfile />}></Route>
				<Route path="/" element={<Profile />}></Route>
				<Route path="/friend" element={<ViewFriends />}></Route>
				<Route path="/game" element={<Game />}></Route>
				<Route path="/gameChat" element={<GameChat />}></Route>
				<Route path="/chat/:id" element={<Chat />}></Route>
				<Route path="/chat" element={<Chat />}></Route>
			</Routes>
		</>
	);
}
