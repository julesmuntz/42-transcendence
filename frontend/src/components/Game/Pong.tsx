import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import {
	DataBall,
	DataDvd,
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
	ballReset,
	dvdReset
} from '../../shared/config/pong.config';
import { WebSocketContext, useSocketEvent } from '../../contexts/WebSocketContext';
import { UserContext } from '../../contexts/UserContext';
import Board from './Board';
import './Pong.css';

export default function Pong() {
	const userContext = useContext(UserContext);
	const socket = useContext<Socket | undefined>(WebSocketContext);

	const [id, setId] = useState(0);
	const [t, setT] = useState<DataTime>({ update: new Date(), kickoff: new Date() });
	const [ping, setPing] = useState<DataPing>({ ...pingReset });
	const [player1, setPlayer1] = useState<DataPlayer>({ ...playerLeftReset });
	const [player2, setPlayer2] = useState<DataPlayer>({ ...playerRightReset });
	const [ball, setBall] = useState<DataBall>({ ...ballReset });
	const [ratio, setRatio] = useState(Math.min(
				(window.innerWidth - 45) / board.w,
				window.innerHeight / board.h));
	const [hide, setHide] = useState(false);
	const [dvd, setDvd] = useState<DataDvd>({ ...dvdReset });
	const [upIsPressed, setUpIsPressed] = useState(false);
	const [downIsPressed, setDownIsPressed] = useState(false);

	useSocketEvent(socket, 'ping', (n: number) => {
		if (n < ping.nMostRecentPingReceived)
			return ;
		var newPing = ping;

		newPing.nMostRecentPingReceived = n;
		newPing.latency = new Date().getTime() - newPing.timePingSent[n].getTime();
		setPing(newPing);
	});
	useSocketEvent(socket, 'pong_accept', (id: number) => {
		setId(id);
	});
	useSocketEvent(socket, 'pong_update', (data: DataUpdate) => {
		setT({
			update: new Date(data.t.update),
			kickoff: new Date(data.t.kickoff)
		});
		if (id === 1) {
			setPlayer1(data.player1);
			setPlayer2(data.player2);
			setBall(data.ball);
		}
		else {
			data.player2.position = 0;
			setPlayer1(data.player2);
			data.player1.position = 1;
			setPlayer2(data.player1);
			data.ball.x = board.w - data.ball.x;
			data.ball.vx = -data.ball.vx;
			setBall(data.ball);
		}
	});

	useEffect(() => {
		const intervalID: any = setInterval(() => {
			var newPing = ping;

			socket?.emit('ping', newPing.nMostRecentPingSent);
			newPing.timePingSent[newPing.nMostRecentPingSent] = new Date();
			newPing.nMostRecentPingSent += 1;
			setPing(newPing);
		}, 1000);
		window.addEventListener('keydown', manageKeydown);
		window.addEventListener('keyup', manageKeyup);
		window.addEventListener('resize', manageResize);
		console.log("pong_join");
		socket?.emit('pong_join', userContext.user.info.id);
		return (() => {
			clearInterval(intervalID);
			window.removeEventListener('keydown', manageKeydown);
			window.removeEventListener('keyup', manageKeyup);
			window.removeEventListener('resize', manageResize);
		});
	}, []);

	function manageKeydown(e: KeyboardEvent): void {
		if (e.repeat)
			return ;
		if (e.key === "s" || e.key === "ArrowDown") {
			setDownIsPressed(true);
			socket?.emit('pong_move', 1);
		}
		if (e.key === "w" || e.key === "ArrowUp") {
			setUpIsPressed(true);
			socket?.emit('pong_move', -1);
		}
		if (e.key === "p") {
			var newPing = ping;
			newPing.hide = !ping.hide;
			setPing(newPing);
		}
		if (e.key === "h") {
			setHide(!hide);
		}
		if (e.key === "d") {
			var newDvd = dvd;
			newDvd.activate = !dvd.activate;
			setDvd(newDvd);
		}
	}

	function manageKeyup(e: KeyboardEvent): void {
		if (e.key === "s" || e.key === "ArrowDown")
			setDownIsPressed(false);
		if (e.key === "w" || e.key === "ArrowUp")
			setUpIsPressed(false);
		if ((!downIsPressed || e.key === "s" || e.key === "ArrowDown")
			&& (!upIsPressed || e.key === "w" || e.key === "ArrowUp"))
			socket?.emit('pong_move', 0);
	}

	function manageResize(): void {
		setRatio(Math.min(
			(window.innerWidth - 45) / board.w,
			window.innerHeight / board.h)
		);
	}

	function refresh(): void {
		socket?.emit('pong_refresh');
	}

	return (
		<div className="Pong">
			<Board
				ball={ball}
				connected={true}
				ping={ping}
				player1={player1}
				player2={player2}
				refresh={refresh}
				t={t}
				ratio={ratio}
				hide={hide}
				dvd={dvd}
			/>
		</div>
	);
}
