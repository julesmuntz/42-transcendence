import React from 'react';
import { io, Socket } from 'socket.io-client';
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '../../shared/interfaces/events.interface';
import {
	DataBall,
	DataPing,
	DataPlayer,
	DataTime,
	DataUpdate,
} from '../../shared/interfaces/data.interface';
import {
	board,
	pingReset,
	playerLeftReset,
	playerRightReset,
	ballReset
} from '../../shared/config/pong.config';
import Board from './Board';
import './Pong.css';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://${process.env.REACT_APP_HOSTNAME}:3030`);

export default class Pong extends React.Component<{}, {
	id: number,
	connected: boolean,
	t: DataTime,
	ping: DataPing,
	player1: DataPlayer,
	player2: DataPlayer,
	ball: DataBall,
	ratio: number,
	upIsPressed: boolean,
	downIsPressed: boolean}> {
	constructor(props: any) {
		super(props);
		this.state = {
			id: 0,
			connected: true,
			t: {
				update: new Date(),
				kickoff: new Date()
			},
			ping: { ...pingReset },
			player1: { ...playerLeftReset },
			player2: { ...playerRightReset },
			ball: { ...ballReset },
			ratio: Math.min(
				window.innerWidth / board.w,
				window.innerHeight / board.h),
			upIsPressed: false,
			downIsPressed: false,
		}
		window.addEventListener('keydown', (e: KeyboardEvent) => this.manageKeydown(e));
		window.addEventListener('keyup', (e: KeyboardEvent) => this.manageKeyup(e));
		window.addEventListener('resize', () => this.manageResize());
	}

	setSocketListeners() {
		socket.on('connect', () => { this.setState({ connected: true }); });
		socket.on('disconnect', () => { this.setState({ connected: false }); });
		socket.on('ping', (n: number) => {
			if (n < this.state.ping.nMostRecentPingReceived)
				return ;
			var newPing = this.state.ping;

			newPing.nMostRecentPingReceived = n;
			newPing.latency = new Date().getTime() - newPing.timePingSent[n].getTime();
			this.setState({ ping: newPing });
		});
		socket.on('pong_accept', (id: number) => { console.log(`Accepted ${id}`); this.setState({ id: id }); });
		socket.on('pong_update', (data: DataUpdate) => {
			this.setState({
				t: { update: new Date(data.t.update),
					kickoff: new Date(data.t.kickoff) },
				player1: data.player1,
				player2: data.player2,
				ball: data.ball,
			});
		});
	}

	setPeriodicFunctions() {
		setInterval(() => {
			var newPing = this.state.ping;

			socket.emit('ping', newPing.nMostRecentPingSent);
			newPing.timePingSent[newPing.nMostRecentPingSent] = new Date();
			newPing.nMostRecentPingSent += 1;
			this.setState({ ping: newPing });
		}, 1000);
	}

	componentDidMount() {
		this.manageResize();
		this.setSocketListeners();
		this.setPeriodicFunctions();
		socket.emit('pong_join');
	}

	componentWillUnmount() {
		socket.off('connect');
		socket.off('disconnect');
		socket.off('ping');
		socket.off('pong_accept');
		socket.off('pong_update');
	}

	manageKeydown(e: KeyboardEvent) {
		if (e.repeat)
			return ;
		if (e.key === "s" || e.key === "ArrowDown") {
			this.setState({ downIsPressed: true });
			socket.emit('pong_move', 1);
		}
		if (e.key === "w" || e.key === "ArrowUp") {
			this.setState({ upIsPressed: true });
			socket.emit('pong_move', -1);
		}
		if (e.key === "p") {
			var newPing = this.state.ping;
			newPing.hide = !this.state.ping.hide;
			this.setState({ ping: newPing });
		}
	}

	manageKeyup(e: KeyboardEvent) {
		if (e.key === "s" || e.key === "ArrowDown")
			this.setState({ downIsPressed: false });
		if (e.key === "w" || e.key === "ArrowUp")
			this.setState({ upIsPressed: false });
		if ((this.state.downIsPressed || this.state.upIsPressed)
			&& !(this.state.downIsPressed && this.state.upIsPressed))
			socket.emit('pong_move', 0);
	}

	manageResize() {
		this.setState({ ratio: Math.min(
			window.innerWidth / board.w,
			window.innerHeight / board.h)
		});
	}

	refresh() {
		socket.emit('pong_refresh');
	}

	render() {
		return (
			<div className="Pong">
				<Board
					ball={this.state.ball}
					connected={this.state.connected}
					ping={this.state.ping}
					player1={this.state.player1}
					player2={this.state.player2}
					refresh={this.refresh}
					t={this.state.t}
					ratio={this.state.ratio}
					id={this.state.id}
				/>
			</div>
		);
	}
}
