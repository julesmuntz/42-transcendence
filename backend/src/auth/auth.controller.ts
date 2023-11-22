import { Controller, Get, UseGuards } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./utils/Guards";

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
}