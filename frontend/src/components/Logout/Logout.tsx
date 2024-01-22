import { useContext } from 'react';
import { WebSocketContext } from '../../contexts/WebSocketContext';
import Cookies from "js-cookie";
import { Socket } from 'socket.io-client';

export default function Logout() {
	const socket = useContext<Socket | undefined>(WebSocketContext);

	socket?.disconnect();
	Cookies.remove("access_token");
	window.location.href = "/";
	return (<></>);
}
