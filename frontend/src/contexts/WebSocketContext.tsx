import { createContext, useEffect, useState, useMemo, ReactNode, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const WebSocketContext = createContext<Socket | undefined>(undefined);

enum NotificationType {
	Info,
	Success,
	Warning,
	Error,
}

interface Notification {
	type: NotificationType;
	message: string;
}

export const useSocketEvent = (socket: Socket | undefined, event: string, handler: any): void => {
	useEffect(() => {
		socket?.on(event, handler);
		return (): void => {
			socket?.off(event);
		};
	}, [socket, event, handler]);
}

function WebSocketProvider({
	children,
}: {
	children: ReactNode;
}): React.JSX.Element {
	const { user } = useContext(UserContext);
	const [socket, setSocket] = useState<Socket | undefined>(undefined);

	useEffect(() => {
		if (user?.info.id && user.authToken) {
			const socketIOClient = io(`http://${process.env.REACT_APP_HOSTNAME}:3030`, {
				query: { userId: user?.info.id, token: user.authToken },
			});
			setSocket(socketIOClient);
			// socketIOClient.on("connect", () => { socketIOClient.emit("saveusersocket", user?.info.id);}); //a true ici
			socketIOClient.on("notification", (notification: Notification) => {
				const notificationFunctions = {
					[NotificationType.Info]: toast.info,
					[NotificationType.Success]: toast.success,
					[NotificationType.Warning]: toast.warning,
					[NotificationType.Error]: toast.error,
				};
				notificationFunctions[notification.type](notification.message);
			});
			return () => {
				socketIOClient.off("connect");
				socketIOClient.disconnect();
			};
		}
	}, [user?.info.id, user.authToken]);
	const value = useMemo(() => socket, [socket]);
	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	);
}

export default WebSocketProvider;
