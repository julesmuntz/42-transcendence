import React, { ReactNode } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { GearWideConnected } from 'react-bootstrap-icons';
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import ProfileModifier from "./ProfileModifier";

interface Props {
	children?: ReactNode;
	onClick: any;
}

export type Ref = HTMLButtonElement;

export default function ProfileSecurity({ qrset }: { qrset: { qrcode: string, setQrcode: any } }) {
	const userContext = useContext(UserContext);

	let getQrcode = async () => {
		return fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/2fa/generate`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then((res) => {
			const reader = res.body?.getReader();
			return new ReadableStream({
				start(controller) {
					return pump();
					function pump(): any {
						return reader?.read().then(({ done, value }) => {
							if (done) {
								controller.close();
								return;
							}
							controller.enqueue(value);
							return pump();
						});
					}
				}
			});
		}).then((stream) => new Response(stream))
			.then((response) => response.blob())
			.then((blob) => URL.createObjectURL(blob))
			.then((url) => qrset.setQrcode(url))
			.catch((err) => console.error(err));
	};

	async function activate2FA(e: any) {
		e.preventDefault();
		await getQrcode();
	};

	async function deactivate2FA(e: any) {
		e.preventDefault();
		return fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/api/2fa/turn-off`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${userContext.user.authToken}`
			}
		}).then(() => {
			const newUser = userContext.user.info;
			newUser.isTFAEnabled = false;
			userContext.login(newUser, userContext.user.authToken);
		});
	}

	const CustomToggle = React.forwardRef<Ref, Props>((props, ref) => (
		<Button
			variant='dark'
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				props.onClick(e);
			}}
		>
			{props.children}
		</Button>
	));

	// const modifyInfos = () => {

	// }

	return (
		<>
			<Dropdown>
				<Dropdown.Toggle as={CustomToggle}>
					<GearWideConnected color="#535f71" size={25} />
				</Dropdown.Toggle>
				<Dropdown.Menu variant='dark'>
					{!userContext.user.info.isTFAEnabled ? <Dropdown.Item eventKey="1" onClick={activate2FA}>Activate 2FA</Dropdown.Item> :
						<>
							<Dropdown.Item onClick={activate2FA}>Reactivate 2FA</Dropdown.Item>
							<Dropdown.Item onClick={deactivate2FA}>Deactivate 2FA</Dropdown.Item>
						</>
					}
					<ProfileModifier />
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
}
