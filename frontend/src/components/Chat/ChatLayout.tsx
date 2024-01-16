import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Room } from '../../shared/chats.interface';
import CreateChannel from '../channel/createChannel';

export const useRoomQuery = (roomName: string, isConnected: boolean) => {
	const query = useQuery({
		queryKey: ['rooms', roomName],
		queryFn: (): Promise<Room> =>
			axios.get(`http://${process.env.REACT_APP_HOSTNAME}:3030/chats/rooms/${roomName}`).then((response) => response.data),
		refetchInterval: 60000,
		enabled: isConnected,
	});
	return query;
};

export const ChatLayout = ({ children }: { children: React.ReactElement[] }) => {
	return (
		<div className="container">
			<div className="content container-fluid bootstrap snippets bootdey">
				<div className="row row-broken">
					<div className="col-sm-3 col-xs-12">
						<div className="col-inside-lg decor-default chat" tabIndex={5000}>
							<div className="chat-users">
								<CreateChannel />
							</div>
						</div>
					</div>
					<div className="col-sm-9 col-xs-12 big-chat-div" tabIndex={5001}>
						<div className="col-inside-lg chat">
							<div className="chat-body">
								{children}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
