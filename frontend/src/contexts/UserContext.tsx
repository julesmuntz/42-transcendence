import {useState, createContext} from 'react';

export interface Info {
	TFASecret: string;
	avatarDefault: string;
	avatarPath: string;
	email: string;
	id: number;
	isTFAEnabled: boolean;
	status: string;
	username: string;
}

export interface Iuser {
	info : Info;
	auth : boolean;
	authToken : string;
};

export interface IFriends {
	id: number;
	user1: Info;
	user2: Info;
	type: string;
}

interface ContextProps {
	user: Iuser;
	login: (info : Info, authToken: string) => void;
	logout: () => void;
}

export const UserContext = createContext<ContextProps>({ user: {info: {} as Info, auth: false, authToken: ''}, login: () => null, logout: () => null });

export default function UserProvider({ children } : any) {
	const [user, setUser] = useState<Iuser>({info: {} as Info, auth: false, authToken: ''});

	const login = (info : Info, authToken: string) => {
		setUser((user : Iuser) => ({
			info: info,
			auth: true,
			authToken: authToken
		}));
	};

	const logout = () => {
		setUser((user : Iuser) => ({
			info: {} as Info,
			auth: false,
			authToken: ''
		}));
	};

	return (
		<UserContext.Provider value={{user, login, logout}}>
			{children}
		</UserContext.Provider>
	);
}
