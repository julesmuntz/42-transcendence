export interface DataMove {
	id: string;
	direction: number;
}

export interface DataUpdate {
	t: DataTime;
	ping: DataPing;
	player1: DataPlayer;
	player2: DataPlayer;
	ball: DataBall;
}

export interface DataTime {
	update: Date;
	kickoff: Date;
}

export interface DataPing {
	timePingSent: Date[];
	nMostRecentPingReceived: number;
	nMostRecentPingSent: number;
	latency: number;
	hide: boolean;
}

export interface DataBall {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
	kickoff: boolean;
}

export interface DataPlayer {
	score: number;
	y: number;
	vy: number;
	position: number,
}

export interface DataCanvas {
	w: number;
	h: number;
	margin: number;
}

export interface DataIds {
	id1: string;
	id2: string;
}
