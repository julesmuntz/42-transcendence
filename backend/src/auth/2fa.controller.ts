import { ClassSerializerInterceptor, Controller, Post, Get, UseInterceptors, Res, Req, HttpCode, Body, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { Public } from "./decorator/public.decorator";
import TFACodeDto from "./dto/2fa.dto";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TFAController {
	constructor(
		private readonly TFAService: AuthService,
		private readonly usersService: UsersService,

	) {}

	//si la 2fa n'est pas encore activer !
	@Get("generate")
	async register(@Res() response: Response, @Req() request: any) {
		const { otpauthUrl } = await this.TFAService.generateTFASecret(request.user.users as User);
		return this.TFAService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post("turn-on")
	@HttpCode(200)
	async turnOnTFA(
		@Req() request: any,
		// @Res() res:  Response,
		@Body() TFACode: TFACodeDto
	) {
		console.log("BEFORE: " + request.user.users.id);
		const updatedUser = await this.usersService.findOne(request.user.users.id);
		console.log("UPDATE:  " + updatedUser.id);
		console.log(updatedUser.TFASecret);
		console.log(TFACode.TFACode);
		const isCodeValid =
			this.TFAService.isTFACodeValid(
				TFACode.TFACode,
				updatedUser.TFASecret
			);
		console.log("SUPER");
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}
		console.log("HELLO");
		await this.usersService.turnOnTFA(request.user.users.id);
		const finalUser = await this.usersService.findOne(updatedUser.id);
		return finalUser;
		// return res.redirect('http://localhost:3000');
	}

	@Public()
	@Post("authenticate")
	@HttpCode(200)
	async authenticate(
		@Res() res: Response,
		@Body() body: { id: number, TFASecret: string, TFACode: string }
	) {
		console.log(body);
		const isCodeValid = this.TFAService.isTFACodeValid(body.TFACode, body.TFASecret);
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}
		const user = await this.usersService.findOne(body.id);
		const access_token = this.TFAService.generateJwt(user);
		res.cookie('access_token', `${access_token}`);

		return res.redirect('http://localhost:3000');
	}
}
