import {useState, createContext} from 'react';


interface Iuser {
	email : string;
	auth : boolean;
};

interface ContextProps {
	user: Iuser;
	login: (email: string) => void;
	logout: () => void;
}

const UserContext = createContext<ContextProps>({ user: {email: '', auth: false}, login: () => null, logout: () => null });

export default function UserProvider({ children } : any) {
	const [user, setUser] = useState<Iuser>({email: '', auth: false});

	const login = (email : string) => {
		setUser((user : Iuser) => ({
			email: email,
			auth: true
		}));
	};

	const logout = () => {
		setUser((user : Iuser) => ({
			email: '',
			auth: false
		}));
	};

	return (
		<UserContext.Provider value={{user, login, logout}}>
			{children}
		</UserContext.Provider>
	);
}
