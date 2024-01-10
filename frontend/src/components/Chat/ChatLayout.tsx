import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Room } from '../../shared/chats.interface';

export const useRoomQuery = (roomName: string, isConnected: boolean) => {
	const query = useQuery({
		queryKey: ['rooms', roomName],
		queryFn: (): Promise<Room> =>
			axios.get(`http://paul-f4Ar7s9:3030/chats/rooms/${roomName}`).then((response) => response.data),
		refetchInterval: 60000,
		enabled: isConnected,
	});
	return query;
};

export const ChatLayout = ({ children }: { children: React.ReactElement[] }) => {
	return (
		<div className="container">
			<div className="col-md-12 col-lg-6">
				<div className="panel">
					{children}
				</div>
			</div>
		</div>
	);
};