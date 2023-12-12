import { Controller, Get, UseGuards, Req,  Res } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guard/42.Guards";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { User } from "../users/entities/user.entity";
import { UsersService } from "users/users.service";
import { statusOffline } from "users/dto/update-user.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService : AuthService,
			private readonly userService: UsersService) {}

	@Public()
	@Get("callback")
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any,  @Res() res: Response) {
		const userDetails = {username: req.user._json.login, email: req.user._json.email, avatarDefault: req.user._json.image.link};
		const result = await this.authService.login(userDetails);
		const expirationDate = new Date();
		if (result instanceof User)
		{
			expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); // 3 minutes en millisecondes
			res.cookie(`id`, `${result.id}`, { expires: expirationDate });
			res.cookie('TFASecret', `${result.TFASecret}`, { expires: expirationDate });
			return res.redirect('http://localhost:3000');
		}

		expirationDate.setDate(expirationDate.getDate() + 7);
		res.cookie('access_token', `${result}`, { expires: expirationDate });
		console.log(result);
		return res.redirect('http://localhost:3000');
	}

	@Get("logout")
	async logout(@Req() req: any) {
		return this.userService.update(req.user.sub, statusOffline);
	}

	@Get("status")
	user(@Req() request: Request) {
		return request.user;
	}
}
