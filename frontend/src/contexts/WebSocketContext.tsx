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

function WebSocketProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (user?.info.id && user.authToken) {
      const socketIOClient = io(`http://paul-f4Ar7s8:3030`, {
        query: { userId: user?.info.id, token: user.authToken },
		autoConnect: true,
      });
      console.log("socket !")
      setSocket(socketIOClient);
      socketIOClient.on("connect", () => { socketIOClient.emit("saveusersocket", user?.info.id); });
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
        socketIOClient.disconnect();
      };    }
  }, [user?.info.id, user.authToken]);
  const value = useMemo(() => socket, [socket]);
  return (
    <WebSocketContext.Provider value={value}>
      {children}
      {/* <ToastContainer /> */}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;