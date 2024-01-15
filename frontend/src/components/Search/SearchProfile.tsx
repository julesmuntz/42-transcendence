import { useContext, useState } from "react";
import { Info, UserContext } from "../../contexts/UserContext";
import Form from 'react-bootstrap/Form';
import "./SearchProfile.css"
import Friends from "../Friends/Friends";

export default function SearchProfile() {
	const userContext = useContext(UserContext);
	const [Users, setUsers] = useState<Info[]>([]);

	async function handelsearch(e: any) {
		if (e.target.value) {
			return (fetch(`http://${process.env.REACT_APP_HOSTNAME}:3030/users/search/${e.target.value}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${userContext.user.authToken}`
				}
			}).then((res) => res.json())
				.then((ret) => {
					setUsers(ret);
				})
			);
		}
		else
			setUsers([]);
	}

	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-md">
						<Form>
							<input type="search" name="User" id="" onInput={handelsearch} />
						</Form>

						<div className="people-nearby">
							{Array.isArray(Users) && Users.length > 0 ? (
								Users.map((user) => (
									<div className="nearby-user" key={user.id}>
										<div className="row">
											<div className="col-md-2 col-sm-2">
												<img src={user.avatarDefault} alt={user.username} className="profile-photo-lg" />
											</div>
											<div className="col-md-7 col-sm-7">
												<h5>
													<p className="profile-link">
														<br />
														{user.username}
													</p>
												</h5>
											</div>
											<div className="col-md-3 col-sm-3">
												<br />
												{user.id !== userContext.user.info.id && <Friends IdUserTarget={user.id} />}
											</div>
										</div>
									</div>
								))
							) : (
								<p>No users available.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}




