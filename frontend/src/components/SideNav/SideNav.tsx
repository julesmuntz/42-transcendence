import Nav from "react-bootstrap/Nav";
import { BalloonHeart, PersonCircle } from "react-bootstrap-icons";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Super from "../Super/Super";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import "./SideNav.css";


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
						<NavLink to="/super">
							<BalloonHeart color="white" size={25} />
						</NavLink>
					</Nav.Item>
				</div>
			</Nav>
			<Routes>
				<Route path="/profile" element={<Profile />}></Route>
				<Route path="/" element={<Home />}></Route>
				<Route path="/super" element={<Super />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
