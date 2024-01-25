import { useState, createContext, useEffect } from 'react';

export interface Info {
	avatarDefault: string;
	avatarPath: string;
	email: string;
	id: number;
	isTFAEnabled: boolean;
	status: string;
	username: string;
}
export interface Iuser {
	info: Info;
	auth: boolean;
	authToken: string;
};

export interface IFriends {
	id?: number;
	user1: Info;
	user2: Info;
	type: string;
	roomName?: string;
}

interface ContextProps {
	user: Iuser;
	login: (info: Info, authToken: string) => void;
	logout: () => void;
	connectUser: (info: Info) => void;
	setTocken: (id: number, token: string) => void;
	setState: (state: string) => void;
}

export function useEmits(socket: any, event: string, data: any) {
	useEffect(() => {
		const initializeEmits = async () => {
			await new Promise<void>(resolve => {
				if (socket?.connected) {
					resolve();
				} else {
					socket?.on('connect', () => resolve());
				}
			});
			socket.emit(event, data);
		};
		initializeEmits();
	}, [socket, event, data]);
}

export const UserContext = createContext<ContextProps>({ user: { info: {} as Info, auth: false, authToken: '' }, login: () => null, logout: () => null, connectUser: () => null, setTocken: () => null, setState: () => null });

export default function UserProvider({ children }: any) {
	const [user, setUser] = useState<Iuser>({ info: {} as Info, auth: false, authToken: '' });

	const login = (info: Info, authToken: string) => {
		setUser((user: Iuser) => ({
			info: info,
			auth: true,
			authToken: authToken
		}));
	};

	const setTocken = (id: number ,token: string) => {
		setUser((user: Iuser) => ({
			info: { ...user.info, id: id },
			auth: true,
			authToken: token
		}));
	}

	const setState = (state: string) => {
		console.log(`setState ${state}`);
		setUser((user: Iuser) => ({
			info: { ...user.info, status: state },
			auth: user.auth,
			authToken: user.authToken
		}));
	}

	const connectUser = (info: Info) => {
		setUser((user: Iuser) => ({
			info: info,
			auth: true,
			authToken: user.authToken
		}));
	}

	const logout = () => {
		setUser(() => ({ info: {} as Info, auth: false, authToken: ''}));
	};

	return (
		<UserContext.Provider value={{ user, login, logout, connectUser, setTocken, setState }}>
			{children}
		</UserContext.Provider>
	);
}
