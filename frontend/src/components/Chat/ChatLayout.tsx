import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Room } from '../../shared/chats.interface';
import ViewChannelPrivate from '../channel/ViewChannelPrivate';
import ViewChannelPublic from '../channel/ViewChannelPublic';
import ViewChannelProtected from '../channel/ViewChannelProtected';
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
		<main className="content">
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
          	<div className="row g-0">
          	  <div className="col-12 col-lg-5 col-xl-3 border-right">
					<CreateChannel />
          	  </div>
          	      <div className="col-12 col-lg-7 col-xl-9">
          	    <div className="position-relative">
          	      <div className="chat-messages p-4">
          	        <div className="panel">{children}</div>
          	      </div>
          	    </div>
          	  </div>
          	</div>
          </div>
        </div></main>
      );
};
