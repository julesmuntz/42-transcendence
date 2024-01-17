import React from 'react';
import { board, paddle } from '../../shared/config/pong.config';
import {
	DataBall,
	DataPing,
	DataPlayer,
	DataTime,
	DataUpdate,
} from '../../shared/interfaces/data.interface';
import {
	launchBall,
	ballInteraction,
	reflectBall,
	updateData,
} from '../../shared/functions/game';

export default class Board extends React.Component<{
	ball: DataBall,
	connected: boolean,
	ping: DataPing,
	player1: DataPlayer,
	player2: DataPlayer,
	refresh: any,
	t: DataTime,
	ratio: number,
	id: number}, {}> {
	drawServerUnreachable(ctx: CanvasRenderingContext2D) {
		const fontsize = board.h * this.props.ratio / 10;

		ctx.font = `${fontsize}px serif`;
		ctx.fillStyle = "white";
		ctx.fillText(
			"Server connection lost",
			board.w * this.props.ratio / 2 - 12 * fontsize / 2,
			board.h * this.props.ratio / 2 - fontsize / 2);
		ctx.fillText(
			"Game canceled",
			board.w * this.props.ratio / 2 - 8 * fontsize / 2,
			board.h * this.props.ratio / 2 + fontsize / 2);
	}

	drawWinningScreen(ctx: CanvasRenderingContext2D) {
		const fontsize = board.h * this.props.ratio / 10;
		const	time_fade_begin = 500;
		const	time_fade_end = 3000;
		const	time_fade2_begin = 3500;
		const	time_fade2_end = 8000;
		const	now = new Date();
		const	duration = now.getTime() - this.props.t.kickoff.getTime();
		var		alpha;
		var		alpha2;

		if (duration <= time_fade_begin)
			return ;
		else if (duration <= time_fade_end) {
			alpha = (duration - time_fade_begin) / (time_fade_end - time_fade_begin);
			alpha *= alpha;
		}
		else
			alpha = 1;
		if (duration <= time_fade2_begin)
			alpha2 = 0;
		else if (duration <= time_fade2_end)
			alpha2 = 0.7 * (duration - time_fade2_begin) / (time_fade2_end - time_fade2_begin);
		else
			alpha2 = 0.7;
		ctx.font = `${fontsize}px serif`;
		ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
		ctx.fillText(
			"The end",
			board.w * this.props.ratio / 2 - 12 * fontsize / 2,
			board.h * this.props.ratio / 2 - 5 * fontsize / 4);
		ctx.fillText(
			`${this.props.player1.score} - ${this.props.player2.score}`,
			board.w * this.props.ratio / 2 + 4 * fontsize / 2,
			board.h * this.props.ratio / 2 + fontsize / 4);
		ctx.font = `${fontsize/2}px serif`;
		ctx.fillStyle = `rgba(255, 255, 255, ${alpha2})`
		if ((this.props.id === 1 && this.props.player1.score >= this.props.player2.score)
			|| (this.props.id === 2 && this.props.player2.score >= this.props.player1.score))
			ctx.fillText(
				"You won",
				board.w * this.props.ratio / 2 - 4 * fontsize / 4,
				board.h * this.props.ratio - 3 * fontsize / 2);
		else
			ctx.fillText(
				"You lost",
				board.w * this.props.ratio / 2 - 4 * fontsize / 4,
				board.h * this.props.ratio - 3 * fontsize / 2);
	}

	drawWaitingScreen(ctx: CanvasRenderingContext2D) {
		const fontsize = board.h * this.props.ratio / 10;

		ctx.font = `${fontsize}px serif`;
		ctx.fillStyle = "white";
		ctx.fillText(
			"Looking for an opponent",
			board.w * this.props.ratio / 2 - 12 * fontsize / 2,
			board.h * this.props.ratio / 2 - fontsize / 2);
		ctx.fillText(
			"Please wait...",
			board.w * this.props.ratio / 2 - 8 * fontsize / 2,
			board.h * this.props.ratio / 2 + fontsize / 2);
	}

	drawPing(ping: DataPing, ctx: CanvasRenderingContext2D) {
		const fontsize = board.h * this.props.ratio / 28;

		if (ping.hide)
			return ;
		ctx.font = `${fontsize}px serif`;
		ctx.fillStyle = "grey";
		ctx.fillText(
			`${ping.latency}ms`.padStart(5, ' '),
			board.w * this.props.ratio / 2 - 3 * fontsize / 2,
			board.h * this.props.ratio * 20 / 21 - fontsize / 3);
	}

	drawScore(player: DataPlayer, ctx: CanvasRenderingContext2D) {
		const	fontsize = board.h * this.props.ratio / 7;
		const	x = (player.position === 0)
			? board.w * this.props.ratio / 4 - fontsize / 2
			: board.w * this.props.ratio * 3 / 4 - fontsize / 2;
		const	time_spawn = 800;
		const	time_fade_start = 3000;
		const	time_fade_end = 4500;
		const	now = new Date();
		const	duration = now.getTime() - this.props.t.kickoff.getTime();
		var		alpha;

		if (duration >= time_fade_end)
			return ;
		else if (duration >= time_fade_start)
			alpha = 1 - (duration - time_fade_start) / (time_fade_end - time_fade_start);
		else if (duration >= time_fade_start)
			alpha = 1;
		else
			alpha = duration / time_spawn;
		ctx.font = `${fontsize}px serif`;
		ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
		ctx.fillText(`${player.score}`, x, board.h * this.props.ratio / 2 + fontsize / 3);
	}

	createGradientDragEffect(ball: DataBall, drag: number, v: number, ctx: CanvasRenderingContext2D) {
		const lowSpeedFilter =
			0.5 * v * v / (board.w * board.w * 4 + v * v);
		const gradient = ctx.createRadialGradient(0, 0, ball.r / 2, 0, 0, drag);

		gradient.addColorStop(0, `rgba(0, 0, 255, ${lowSpeedFilter})`);
		gradient.addColorStop(1, "rgba(0, 0, 255, 0)");
		return (gradient);
	}

	drawPongNet(ctx: CanvasRenderingContext2D) {
		const	netColor = "rgba(200, 200, 200, 0.9)";
		const	nbNet = 10;
		const	netWidth = board.w * this.props.ratio / 150;
		const	netHeight = board.h * this.props.ratio / (2 * nbNet + 1);
		var		x;
		var		y;

		ctx.fillStyle = netColor;
		for (let i = 0; i < ((this.props.ping.hide) ? nbNet : nbNet - 1); i++) {
			x = (board.w * this.props.ratio - netWidth) / 2;
			y = netHeight + i * 2 * netHeight;
			ctx.fillRect(x, y, netWidth, netHeight);
		}
	}

	getColorBall(ball: DataBall) {
		if (!ball.kickoff)
			return ("rgba(230, 230, 250, 1)");
		const	rel_dist_paddle =
			(Math.abs(ball.x - board.w / 2) / (board.w / 2 - paddle.margin - paddle.w));
		var		alpha;

		if (rel_dist_paddle < 0.9)
			alpha = rel_dist_paddle / 0.9;
		else
			alpha = 1;
		return (`rgba(230, 230, 250, ${alpha})`);
	}

	drawBall(ball: DataBall, ctx: CanvasRenderingContext2D) {
		const	theta = Math.atan2(-ball.vy, -ball.vx);
		const	v = Math.hypot(ball.vx, ball.vy);
		const	drag = 50 * v / 1000;
		var		ballColor = this.getColorBall(ball);
		const	gradient = this.createGradientDragEffect(ball, drag, v, ctx);
		const	ratio = this.props.ratio;

		// Draw drag effect
		ctx.translate(ball.x * ratio, ball.y * ratio);
		ctx.rotate(theta);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, -ball.r * ratio, drag * ratio, 2 * ball.r * ratio);
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		// Draw ball
		ctx.beginPath();
		ctx.arc(ball.x * ratio, ball.y * ratio, ball.r * ratio, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = ballColor;
		ctx.fill();
	}

	drawPaddle(player: DataPlayer, ctx: CanvasRenderingContext2D) {
		const	playerColor = "rgba(230, 230, 250, 0.9)";
		const	ratio = this.props.ratio;

		if (player.position === 0)
			ctx.translate(paddle.margin * ratio, 0)
		else
			ctx.translate(board.w * this.props.ratio - paddle.margin * ratio - paddle.w * ratio, 0)
		ctx.fillStyle = playerColor;
		ctx.fillRect(0, player.y * ratio, paddle.w * ratio, paddle.h * ratio);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	clearCanvas(ball: DataBall, ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = `rgba(10, 10, 35, 0.92)`;
		ctx.fillRect(0, 0, board.w * this.props.ratio, board.h * this.props.ratio);
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.clearCanvas(this.props.ball, ctx);
		this.drawPing(this.props.ping, ctx);
		this.drawPaddle(this.props.player1, ctx);
		this.drawPaddle(this.props.player2, ctx);
		if (this.props.ball.vx === 0 && this.props.ball.vy === 0) {
			this.drawWaitingScreen(ctx);
			return ;
		}
		if (this.props.player1.score >= 5 || this.props.player2.score >= 5) {
			this.drawWinningScreen(ctx);
			return ;
		}
		if (!this.props.connected) {
			this.drawServerUnreachable(ctx);
			return ;
		}
		this.drawBall(this.props.ball, ctx);
		this.drawPongNet(ctx);
		this.drawScore(this.props.player1, ctx);
		this.drawScore(this.props.player2, ctx);
	}

	manageBallInteraction(data: DataUpdate) {
		switch (ballInteraction(data)) {
			case 'offLimitLeft':  launchBall(data.ball, data.player2, data.t);	break ;
			case 'offLimitRight': launchBall(data.ball, data.player1, data.t);	break ;
			case 'touchPlayer1':  reflectBall(data.ball, data.player1);			break ;
			case 'touchPlayer2':  reflectBall(data.ball, data.player2);			break ;
			default:															return ;
		}
		this.props.refresh();
	}

	update() {
		updateData(this.props);
		this.manageBallInteraction(this.props);
	}

	renderUpdate = () => {
		const htmlElement = document.getElementById("BoardCanvas");
		if (!htmlElement)
			return ;
		const canvas = htmlElement as HTMLCanvasElement;
		const res = canvas.getContext("2d");
		if (!res)
			return ;
		const ctx: CanvasRenderingContext2D = res;

		this.update();
		this.draw(ctx);
		window.requestAnimationFrame(this.renderUpdate);
	};

	componentDidMount() {
		this.renderUpdate();
	}

	componentWillUnmount() {
	}

	render() {
		return (
			<canvas
				id="BoardCanvas"
				width={board.w * this.props.ratio}
				height={board.h * this.props.ratio}>
			</canvas>
		);
	}
}
