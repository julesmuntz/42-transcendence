import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tooltip/dist/react-tooltip.css';
import UserProvider from './contexts/UserContext';
import WebSocketProvider from './contexts/WebSocketContext';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<UserProvider>
		<WebSocketProvider>
			<App />
		</WebSocketProvider>
	</UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
