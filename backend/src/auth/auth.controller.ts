import { Controller, Get, UseGuards, Req, Res, Body, UnauthorizedException, HttpCode } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./utils/Guards";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { UserDetails } from "./utils/interfaces";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService : AuthService) {}
	
	@Get("callback")
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any) {
		const userDetails = {username: req.user._json.login, email: req.user._json.email, avatarPath: req.user._json.image.link};
		return this.authService.login(userDetails);
	}

	@Get("status")
	user(@Req() request: Request) {
		// console.log(request.user);
		if (request.user) return { msg: "Authenticated" };
		else return { msg: "Not authenticated" };
	}
}