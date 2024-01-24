import { DataBall, DataCanvas, DataDvd, DataPing, DataPlayer } from '../interfaces/data.interface';

export const board: DataCanvas = {
	w: 600,
	h: 300,
	margin: 0,
};

export const paddle: DataCanvas = {
	w: board.w / 55,
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

export const dvdReset: DataDvd = {
	activate: false,
	color: 'rgb(230, 230, 250)',
	w: 210,
	h: 107
}

export const ballLaunchVx: number = board.w / 6;

export const playerSpeed: number = board.h;

export const dvdColors: string[] = [
	"rgba(0, 0, 120, 0.9)",
	"rgba(0, 0, 210, 0.9)",
	"rgba(0, 0, 230, 0.9)",
	"rgba(0, 120, 0, 0.9)",
	"rgba(0, 120, 120, 0.9)",
	"rgba(0, 120, 210, 0.9)",
	"rgba(0, 120, 230, 0.9)",
	"rgba(0, 210, 0, 0.9)",
	"rgba(0, 210, 120, 0.9)",
	"rgba(0, 210, 210, 0.9)",
	"rgba(0, 210, 230, 0.9)",
	"rgba(0, 230, 0, 0.9)",
	"rgba(0, 230, 120, 0.9)",
	"rgba(0, 230, 210, 0.9)",
	"rgba(0, 230, 230, 0.9)",
	"rgba(120, 0, 0, 0.9)",
	"rgba(120, 0, 120, 0.9)",
	"rgba(120, 0, 210, 0.9)",
	"rgba(120, 0, 230, 0.9)",
	"rgba(120, 120, 0, 0.9)",
	"rgba(120, 120, 120, 0.9)",
	"rgba(120, 120, 210, 0.9)",
	"rgba(120, 120, 230, 0.9)",
	"rgba(120, 210, 0, 0.9)",
	"rgba(120, 210, 120, 0.9)",
	"rgba(120, 210, 230, 0.9)",
	"rgba(120, 230, 0, 0.9)",
	"rgba(120, 230, 120, 0.9)",
	"rgba(120, 230, 210, 0.9)",
	"rgba(120, 230, 230, 0.9)",
	"rgba(210, 0, 0, 0.9)",
	"rgba(210, 0, 120, 0.9)",
	"rgba(210, 0, 210, 0.9)",
	"rgba(210, 0, 230, 0.9)",
	"rgba(210, 120, 0, 0.9)",
	"rgba(210, 120, 120, 0.9)",
	"rgba(210, 120, 230, 0.9)",
	"rgba(210, 210, 0, 0.9)",
	"rgba(210, 210, 210, 0.9)",
	"rgba(210, 210, 230, 0.9)",
	"rgba(210, 230, 0, 0.9)",
	"rgba(210, 230, 120, 0.9)",
	"rgba(210, 230, 210, 0.9)",
	"rgba(230, 0, 0, 0.9)",
	"rgba(230, 0, 120, 0.9)",
	"rgba(230, 0, 210, 0.9)",
	"rgba(230, 0, 230, 0.9)",
	"rgba(230, 120, 0, 0.9)",
	"rgba(230, 120, 120, 0.9)",
	"rgba(230, 120, 210, 0.9)",
	"rgba(230, 120, 230, 0.9)",
	"rgba(230, 210, 0, 0.9)",
	"rgba(230, 210, 120, 0.9)",
	"rgba(230, 230, 0, 0.9)",
	"rgba(230, 230, 120, 0.9)",
	"rgba(230, 230, 230, 0.9)",
];

export const nbDvdColors: number = 56;
