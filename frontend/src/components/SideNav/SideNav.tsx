import Nav from "react-bootstrap/Nav";
import { PersonFill, ChatLeftDots, Joystick, PeopleFill, Search } from "react-bootstrap-icons";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import "./SideNav.css";
import Game from "../Game/Game";
import ViewFriends from "../Friends/ViewFriends";
import SearchProfile from "../Search/SearchProfile";
import CreateChannel from "../channel/createChannel";
import PublicProfile from "../Profile/PublicProfile";
import Chat from "../Chat/Chat";


export default function SideBar() {
	return (
		<BrowserRouter>
			<Nav className="d-md-block bg-dark sidebar" activeKey="/home">
				<div className="sidebar-sticky">
					<Nav.Item className="pb-1">
						<NavLink to="/profile">
							<PersonFill color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/chat">
							<ChatLeftDots color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/game">
							<Joystick color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/friend">
							<PeopleFill color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/search">
							<Search color="gray" size={22} />
						</NavLink>
					</Nav.Item>
				</div>
			</Nav>
			<Routes>
				<Route path="/profile" element={<Profile />}></Route>
				<Route path="/profile/:id" element={<PublicProfile />}></Route>
				<Route path="/" element={<Home />}></Route>
				<Route path="/friend" element={<ViewFriends />}></Route>
				<Route path="/search" element={<SearchProfile />}></Route>
				<Route path="/game" element={<Game />}></Route>
				<Route path="/chat/:id" element={<Chat />}></Route>
				<Route path="/chat" element={<CreateChannel />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
