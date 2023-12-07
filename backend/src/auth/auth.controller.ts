import { Controller, Get, UseGuards, Req,  Res } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guard/42.Guards";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { User } from "../users/entities/user.entity";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService : AuthService) {}

	@Public()
	@Get("callback")
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any,  @Res() res: Response) {
		const userDetails = {username: req.user._json.login, email: req.user._json.email, avatarDefault: req.user._json.image.link};
		const result = await this.authService.login(userDetails);
		if (result instanceof User)
		{
			res.cookie(`id`, `${result.id}`);
			res.cookie('TFASecret', `${result.TFASecret}`);
			return res.redirect('http://localhost:3000');
		}
		res.cookie('access_token', `${result}`);
		console.log(result);
		return res.redirect('http://localhost:3000');
	}

	@Get("status")
	user(@Req() request: Request) {
		return request.user;
	}
}
