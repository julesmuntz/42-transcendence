import Nav from "react-bootstrap/Nav";
import { PersonFill, Discord, Joystick, PeopleFill, Search } from "react-bootstrap-icons";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Profile from "../Profile/Profile";
import "./SideNav.css";
import Game from "../Game/Game";
import ViewFriends from "../Friends/ViewFriends";
import PublicProfile from "../Profile/PublicProfile";
import Chat from "../Chat/Chat";
import { useState } from "react";

export default function SideBar() {
	const [profileColor, setProfileColor] = useState("#535f71");
	const [chatColor, setChatColor] = useState("#535f71");
	const [gameColor, setGameColor] = useState("#535f71");
	const [friendColor, setFriendColor] = useState("#535f71");
	const [searchColor, setSearchColor] = useState("#535f71");


	return (
		<BrowserRouter>
			<Nav className="d-md-block bg-dark sidebar" activeKey="/home">
				<div className="sidebar-sticky">
					<Nav.Item className="pb-1">
						<NavLink className={({ isActive }) => {
							setProfileColor(isActive ? "#ff7c14" : "#535f71");
							return (isActive ? "active" : "")
						}} to="/profile">
							<PersonFill color={profileColor} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink className={({ isActive }) => {
							setChatColor(isActive ? "#ff7c14" : "#535f71");
							return (isActive ? "active" : "")
						}} to="/chat">
							<Discord color={chatColor} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink className={({ isActive }) => {
							setGameColor(isActive ? "#ff7c14" : "#535f71");
							return (isActive ? "active" : "")
						}} to="/game">
							<Joystick color={gameColor} size={25} />
						</NavLink>
					</Nav.Item>

					<Nav.Item className="pb-1">
						<NavLink className={({ isActive }) => {
							setFriendColor(isActive ? "#ff7c14" : "#535f71");
							return (isActive ? "active" : "")
						}} to="/friend">
							<PeopleFill color={friendColor} size={25} />
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
				<Route path="/chat/:id" element={<Chat />}></Route>
				<Route path="/chat" element={<Chat />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
