import { Controller, Get, UseGuards, Req,  Res, Body, UnauthorizedException, HttpCode, HttpStatus } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guard/42.Guards";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { JwtAuthGuard } from "./guard/jwt.Guards";
import { AuthGuard } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.Strategy";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService : AuthService) {}

	@Public()
	@Get("callback")
	@Redirect("http://localhost:3000")
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any) {
		const userDetails = {username: req.user._json.login, email: req.user._json.email, avatarDefault: req.user._json.image.link};
		return this.authService.login(userDetails);
	}


	@Get("status")
	@UseGuards(JwtAuthGuard)
	user(@Req() request: Request) {
		console.log(request.user);
		 return request.user;
	}
}
