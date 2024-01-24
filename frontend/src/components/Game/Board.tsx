import React from 'react';
import { board, paddle, dvdColors, nbDvdColors } from '../../shared/config/pong.config';
import {
	DataBall,
	DataDvd,
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

const dvdSvg1: string = "M118.895,20.346c0,0-13.743,16.922-13.04,18.001c0.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H81.81H47.812H22.175l-2.56,11.068h19.299h4.579c12.415,0,19.995,5.132,17.878,14.225c-2.287,9.901-13.123,14.128-24.665,14.128H32.39l5.552-24.208H18.647l-8.192,35.368h27.398c20.612,0,40.166-11.067,43.692-25.288c0.617-2.614,0.53-9.185-1.054-13.053c0-0.093-0.091-0.271-0.178-0.537c-0.087-0.093-0.178-0.722,0.178-0.814c0.172-0.092,0.525,0.271,0.525,0.358c0,0,0.179,0.456,0.351,0.813l17.44,50.315l44.404-51.216l18.761-0.092h4.579c12.424,0,20.09,5.132,17.969,14.225c-2.29,9.901-13.205,14.128-24.75,14.128h-4.405L161,19.987h-19.287l-8.198,35.368h27.398c20.611,0,40.343-11.067,43.604-25.288c3.347-14.225-11.101-25.293-31.89-25.293h-18.143h-22.727C120.923,17.823,118.895,20.346,118.895,20.346L118.895,20.346z";
const dvdSvg2: string = "M99.424,67.329C47.281,67.329,5,73.449,5,81.012c0,7.558,42.281,13.678,94.424,13.678c52.239,0,94.524-6.12,94.524-13.678C193.949,73.449,151.664,67.329,99.424,67.329z M96.078,85.873c-11.98,0-21.58-2.072-21.58-4.595c0-2.523,9.599-4.59,21.58-4.59c11.888,0,21.498,2.066,21.498,4.59C117.576,83.801,107.966,85.873,96.078,85.873z";

export default class Board extends React.Component<{
	ball: DataBall,
	connected: boolean,
	ping: DataPing,
	player1: DataPlayer,
	player2: DataPlayer,
	refresh: any,
	t: DataTime,
	ratio: number,
	hide: boolean,
	dvd: DataDvd}, {}> {
	drawServerUnreachable(ctx: CanvasRenderingContext2D) {
		const	fontsize = board.h * this.props.ratio / 10;
		const	font_family = 'Uni, sans';

		ctx.font = `${fontsize}px ${font_family}`;
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
		const	fontsize = board.h * this.props.ratio / 10;
		const	font_family = 'Uni, sans';
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
		ctx.font = `${fontsize}px ${font_family}`;
		ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
		ctx.fillText(
			"The end",
			board.w * this.props.ratio / 2 - 12 * fontsize / 2,
			board.h * this.props.ratio / 2 - 5 * fontsize / 4);
		ctx.fillText(
			`${this.props.player1.score} - ${this.props.player2.score}`,
			board.w * this.props.ratio / 2 + 4 * fontsize / 2,
			board.h * this.props.ratio / 2 + fontsize / 4);
		ctx.font = `${fontsize}px ${font_family}`;
		ctx.fillStyle = `rgba(255, 255, 255, ${alpha2})`
		if (this.props.player1.score >= this.props.player2.score)
			ctx.fillText(
				"You won",
				board.w * this.props.ratio / 2 - 7 * fontsize / 4,
				board.h * this.props.ratio - 3 * fontsize / 2);
		else
			ctx.fillText(
				"You lost",
				board.w * this.props.ratio / 2 - 7 * fontsize / 4,
				board.h * this.props.ratio - 3 * fontsize / 2);
	}

	drawWaitingScreen(ctx: CanvasRenderingContext2D) {
		const	fontsize = board.h * this.props.ratio / 10;
		const	font_family = 'Uni, sans';

		ctx.font = `${fontsize}px ${font_family}`;
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
		const	fontsize = board.h * this.props.ratio / 28;
		const	font_family = 'Uni, sans';

		if (ping.hide)
			return ;
		ctx.font = `${fontsize}px ${font_family}`;
		ctx.fillStyle = "grey";
		ctx.fillText(
			`${ping.latency}ms`.padStart(5, ' '),
			board.w * this.props.ratio / 2 - 3 * fontsize / 2,
			board.h * this.props.ratio * 20 / 21 - fontsize / 3);
	}

	drawScore(player: DataPlayer, ctx: CanvasRenderingContext2D) {
		const	fontsize = board.h * this.props.ratio / 7;
		const	font_family = 'Uni, sans';
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
		ctx.font = `${fontsize}px ${font_family}`;
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

	getColorDvd(ball: DataBall, dvd: DataDvd) {
		if (!ball.kickoff)
			return (dvd.color);
		const	rel_dist_paddle =
			(Math.abs(ball.x - board.w / 2) / (board.w / 2 - paddle.margin - paddle.w));
		var		alpha;

		if (rel_dist_paddle < 0.9)
			alpha = rel_dist_paddle / 0.9;
		else
			alpha = 1;
		return (`rgba(230, 230, 250, ${alpha})`);
	}

	drawDvd(ball: DataBall, dvd: DataDvd, ctx: CanvasRenderingContext2D) {
		const	theta = Math.atan2(-ball.vy, -ball.vx);
		const	v = Math.hypot(ball.vx, ball.vy);
		const	drag = 50 * v / 1000;
		var		ballColor = this.getColorDvd(ball, dvd);
		const	gradient = this.createGradientDragEffect(ball, drag, v, ctx);
		const	ratio = this.props.ratio;

		// Draw drag effect
		ctx.translate(ball.x * ratio, ball.y * ratio);
		ctx.rotate(theta);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, -dvd.h / 4, drag * ratio, dvd.h / 2);
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		// Draw dvd
		ctx.translate(ball.x * ratio - dvd.w / 4, ball.y * ratio - dvd.h / 4);
		ctx.scale(0.5, 0.5);
		ctx.fillStyle = ballColor;
		const path1 = new Path2D(dvdSvg1);
		ctx.fill(path1);
		const path2 = new Path2D(dvdSvg2);
		ctx.fill(path2);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	getColorBall(ball: DataBall) {
		if (!ball.kickoff)
			return ('rgb(230, 230, 250)');
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
		var		alpha = 0.9;
		if (this.props.hide
			&& player.position === 0
			&& !this.props.ball.kickoff) {
			if (this.props.ball.vx < 0)
				alpha = (this.props.ball.x - board.w / 2) / (board.w / 2 - paddle.margin - paddle.w);
			else if (this.props.ball.vy > 0)
				alpha = (this.props.ball.x - paddle.margin - paddle.w) / (board.w / 16);
		}
		alpha = Math.max(0, Math.min(alpha, 0.9));
		const	playerColor = `rgba(230, 230, 250, ${alpha})`;
		const	ratio = this.props.ratio;

		if (player.position === 0)
			ctx.translate(paddle.margin * ratio, 0)
		else
			ctx.translate(board.w * this.props.ratio - paddle.margin * ratio - paddle.w * ratio, 0)
		ctx.beginPath();
		ctx.roundRect(0, player.y * ratio, paddle.w * ratio, paddle.h * ratio, paddle.w / 3 * ratio);
		ctx.closePath();
		ctx.fillStyle = playerColor;
		ctx.fill();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	clearCanvas(ball: DataBall, ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = `rgba(10, 10, 35, 0.92)`;
		ctx.fillRect(0, 0, board.w * this.props.ratio, board.h * this.props.ratio);
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.clearCanvas(this.props.ball, ctx);
		this.drawPing(this.props.ping, ctx);
		if (this.props.ball.vx === 0 && this.props.ball.vy === 0) {
			this.drawWaitingScreen(ctx);
			this.drawPaddle(this.props.player1, ctx);
			this.drawPaddle(this.props.player2, ctx);
			return ;
		}
		if (this.props.player1.score >= 5 || this.props.player2.score >= 5) {
			this.drawWinningScreen(ctx);
			this.drawPaddle(this.props.player1, ctx);
			this.drawPaddle(this.props.player2, ctx);
			return ;
		}
		if (!this.props.connected) {
			this.drawServerUnreachable(ctx);
			return ;
		}
		if (this.props.dvd.activate)
			this.drawDvd(this.props.ball, this.props.dvd, ctx);
		else
			this.drawBall(this.props.ball, ctx);
		this.drawPaddle(this.props.player1, ctx);
		this.drawPaddle(this.props.player2, ctx);
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

	updateDvdColor(dvd: DataDvd, lastBall: DataBall, ball: DataBall) {
		if (lastBall.vx * ball.vx < 0
			|| lastBall.vy * ball.vy < 0)
			dvd.color = dvdColors[Math.floor(Math.random() * nbDvdColors)];
	}

	update() {
		const lastBall: DataBall = { ...this.props.ball };
		updateData(this.props);
		this.manageBallInteraction(this.props);
		this.updateDvdColor(this.props.dvd, lastBall, this.props.ball);
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
