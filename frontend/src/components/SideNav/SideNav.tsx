import Nav from "react-bootstrap/Nav";
import { BalloonHeart, PersonCircle, ChatDots, People, Search } from "react-bootstrap-icons";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Super from "../Chat/Chat";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import "./SideNav.css";
import Friends from "../Friends/Friends";
import SearchProfile from "../Profile/searchProfile";


export default function SideBar() {
	return (
		<BrowserRouter>
			<Nav className="d-md-block bg-dark sidebar" activeKey="/home">
				<div className="sidebar-sticky">
					<Nav.Item className="pb-1">
						<NavLink to="/profile">
							<PersonCircle color="white" size={25}/>
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/chat">
							<ChatDots color="white" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/heart">
							<BalloonHeart color="white" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/friend">
							<People color="white" size={25} />
						</NavLink>
					</Nav.Item>
					<Nav.Item className="pb-1">
						<NavLink to="/search">
							<Search color="white" size={25} />
						</NavLink>
					</Nav.Item>
				</div>
			</Nav>
			<Routes>
				<Route path="/profile" element={<Profile />}></Route>
				<Route path="/" element={<Home />}></Route>
				<Route path="/chat" element={<Super />}></Route>
				<Route path="/friend" element={<Friends IdUserTarget={0} />}></Route>
				<Route path="/search" element={<SearchProfile />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
