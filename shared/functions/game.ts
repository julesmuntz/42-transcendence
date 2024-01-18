import { ballReset, ballLaunchVx, board, paddle } from '../config/pong.config';
import { DataBall, DataPlayer, DataTime, DataUpdate } from '../interfaces/data.interface';

export function launchBall(ball: DataBall, player: DataPlayer, t: DataTime) {
	ball = { ...ballReset };
	ball.vx = (player.position === 0) ? -ballLaunchVx : ballLaunchVx;
	t.kickoff = new Date();
}

export function reflectBall(ball: DataBall, player: DataPlayer) {
	const	relativePos	= ball.y - player.y - paddle.h / 2;
	const	posMax		= paddle.h / 2 + ball.r;
	const	angleMax	= 3 * Math.PI / 8;
	var		v			= Math.hypot(ball.vx, ball.vy);
	var		theta		= relativePos / posMax * angleMax;

	if (player.position === 1)
		theta = -theta + Math.PI;
	v *= (ball.kickoff) ? 3 : 1.02;
	ball.vx = v * Math.cos(theta);
	ball.vy = v * Math.sin(theta);
	ball.kickoff = false;
}

export function ballCrossedPlayerLeft(ball: DataBall): boolean {
	const	border	= paddle.margin + paddle.w + ball.r;
	const	oldX	= ball.x - 100 * ball.vx / 1000;

	return (ball.x <= border && border <= oldX);
}

export function ballCrossedPlayerRight(ball: DataBall): boolean {
	const	border	= board.w - paddle.margin - paddle.w - ball.r;
	const	oldX	= ball.x - 100 * ball.vx / 1000;

	return (oldX <= border && border <= ball.x);
}

export function ballCrossedPlayer(ball: DataBall, player: DataPlayer): boolean {
	if (player.position === 0)
		return (ballCrossedPlayerLeft(ball));
	else
		return (ballCrossedPlayerRight(ball));
}

export function ballInPlayerRange(ball: DataBall, player: DataPlayer): boolean {
	const	limitUp		= player.y - ball.r;
	const	limitDown	= player.y + paddle.h + ball.r;

	return (limitUp <= ball.y && ball.y <= limitDown);
}

export function ballTouchPlayer(ball: DataBall, player: DataPlayer): boolean {
	return (ballCrossedPlayer(ball, player)
		&& ballInPlayerRange(ball, player));
}

export function ballOffLimitLeft(ball: DataBall): boolean {
	return (ball.x + ball.r < 0);
}

export function ballOffLimitRight(ball: DataBall): boolean {
	return (ball.x - ball.r > board.w);
}

export function ballInteraction(data: DataUpdate): string {
	if (ballOffLimitLeft(data.ball))
		return ('offLimitLeft');
	if (ballOffLimitRight(data.ball))
		return ('offLimitRight');
	if (ballTouchPlayer(data.ball, data.player1))
		return ('touchPlayer1');
	if (ballTouchPlayer(data.ball, data.player2))
		return ('touchPlayer2');
	return ('none');
}

export function updateBall(ball: DataBall, dt: number) {
	ball.x += ball.vx * dt;
	ball.y += ball.vy * dt;
	if (ball.y < ball.r) {
		ball.y = 2 * ball.r - ball.y;
		ball.vy = -ball.vy;
	}
	ball.y %= 2 * board.h;
	if (ball.y > board.h - ball.r) {
		ball.y = 2 * (board.h - ball.r) - ball.y;
		ball.vy = -ball.vy;
	}
}

export function updatePlayer(player: DataPlayer, dt: number) {
	player.y += player.vy * dt;
	player.y = Math.max(0, Math.min(player.y, board.h - paddle.h));
}

export function updateData(data: DataUpdate) {
	const newT = new Date();
	const dt = (newT.getTime() - data.t.update.getTime()) / 1000;

	updatePlayer(data.player1, dt);
	updatePlayer(data.player2, dt);
	if (data.player1.score < 5 && data.player2.score < 5)
		updateBall(data.ball, dt);
	data.t.update = newT;
}
