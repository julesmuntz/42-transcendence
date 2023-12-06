import { Controller, Get, UseGuards, Req,  Res, Body, UnauthorizedException, HttpCode, HttpStatus } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guard/42.Guards";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { JwtAuthGuard } from "./guard/jwt.Guards";
import { AuthGuard } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.Strategy";
import { User } from "src/users/entities/user.entity";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService : AuthService) {}

	@Public()
	@Get("callback")
	// @Redirect("http://localhost:3000")
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any,  @Res() res: Response) {
		const userDetails = {username: req.user._json.login, email: req.user._json.email, avatarDefault: req.user._json.image.link};
		const result = await this.authService.login(userDetails);
		if (result instanceof User)
		{
			res.setHeader('Set-Cookie', `TFASecret=${result.TFASecret}`);
			return res.redirect('http://localhost:8080/2fa');
		}
		res.setHeader('Set-Cookie', `access_token=${result}`);
		return res.redirect('http://localhost:8080');
	}

	@Get("status")
	user(@Req() request: Request) {
		console.log(request.user);
		return request.user;
	}
}
