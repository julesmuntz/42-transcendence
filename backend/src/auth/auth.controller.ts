import { Controller, Get } from "@nestjs/common";

@Controller('auth')
export class AuthController{
	@Get('login')
	getLogin() {
		return {msg: 'test login'};
	}
	
	@Get('redirect')
	getRedirect() {
		return {msg: 'test redirect'};
	}
}