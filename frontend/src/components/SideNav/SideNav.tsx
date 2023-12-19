import Nav from "react-bootstrap/Nav";
import { BalloonHeart, PersonCircle, ChatDots, Controller, People, Search } from "react-bootstrap-icons";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import "./SideNav.css";
import ChatPage from "../Chat/Chat";
import Game from "../Game/Game";
import ViewFriends from "../Friends/ViewFriends";
import SearchProfile from "../Profile/searchProfile";


export default function SideBar() {
	return (
		<BrowserRouter>
			<Nav className="d-md-block bg-dark sidebar" activeKey="/home">
				<div className="sidebar-sticky">
					<Nav.Item className="pb-1">
						<NavLink to="/profile">
							<PersonCircle color="gray" size={25}/>
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/chat">
							<ChatDots color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/game">
							<Controller color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/friend">
							<People color="gray" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/search">
							<Search color="gray" size={22} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/">
							<BalloonHeart color="gray" size={25} />
						</NavLink>
					</Nav.Item>
				</div>
			</Nav>
			<Routes>
				<Route path="/profile" element={<Profile />}></Route>
				<Route path="/" element={<Home />}></Route>
				<Route path="/chat" element={<ChatPage />}></Route>
				<Route path="/chat/:id" element={<ChatPage />}></Route>
				<Route path="/friend" element={<ViewFriends />}></Route>
				<Route path="/search" element={<SearchProfile />}></Route>
				<Route path="/game" element={<Game />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
