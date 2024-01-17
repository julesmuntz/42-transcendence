import { DataCanvas, DataBall, DataPing, DataPlayer } from '../interfaces/data.interface';

export const board: DataCanvas = {
	w: 600,
	h: 300,
	margin: 0,
};


export const paddle: DataCanvas = {
	w: board.w / 50,
	h: board.h / 5,
	margin: board.w / 20,
};

export const playerLeftReset: DataPlayer = {
	score: 0,
	y: (board.h - paddle.h) / 2,
	vy: 0,
	position: 0,
}

export const playerRightReset: DataPlayer = {
	score: 0,
	y: (board.h - paddle.h) / 2,
	vy: 0,
	position: 1,
}

export const ballReset: DataBall = {
	x: board.w / 2,
	y: board.h / 2,
	vx: 0,
	vy: 0,
	r: board.w / 80,
	kickoff: true,
}

export const pingReset: DataPing = {
	timePingSent: [],
	nMostRecentPingReceived: 0,
	nMostRecentPingSent: 0,
	latency: 0,
	hide: true,
}

export const ballLaunchVx: number = board.w / 6;

export const playerSpeed: number = board.h;
