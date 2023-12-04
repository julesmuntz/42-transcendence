import Nav from "react-bootstrap/Nav";
import {BalloonHeart, PersonCircle} from "react-bootstrap-icons";


export default function SideBar() {
	return (
		<Nav className="d-md-block bg-dark sidebar" activeKey="/home">
			<div className="sidebar-sticky">
			<Nav.Item className="pb-1">
				<Nav.Link>
					<PersonCircle color="white" size={25}/>
				</Nav.Link>
			</Nav.Item>
			<Nav.Item className="pb-1">
				<Nav.Link>
					<BalloonHeart color="white" size={25} />
				</Nav.Link>
			</Nav.Item>
			</div>
		</Nav>
	);
}
