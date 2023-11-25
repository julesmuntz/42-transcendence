import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./utils/Guards";
import { Request } from "express";

@Controller('auth')
export class AuthController{
	@Get('42/login')
	@UseGuards(FortyTwoAuthGuard)
	getLogin() {
		return {msg: 'test login'};
	}
	
	@Get('42/callback')
	@UseGuards(FortyTwoAuthGuard)
	getRedirect() {
		return {msg: 'test redirect'};
	}

	@Get('status')
	user(@Req() request: Request) {
		// console.log(request.user);
		if (request.user)
			return { msg: 'Authenticated' };
		else
			return { msg: 'Not authenticated' };
	}

}