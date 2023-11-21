import { Controller, Get, UseGuards } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./utils/Guards";

@Controller('auth')
export class AuthController{
	@Get('login')
	@UseGuards(FortyTwoAuthGuard)
	getLogin() {
		return {msg: 'test login'};
	}
	
	@Get('redirect')
	@UseGuards(FortyTwoAuthGuard)
	getRedirect() {
		return {msg: 'test redirect'};
	}
}