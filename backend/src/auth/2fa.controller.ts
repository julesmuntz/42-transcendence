import { ClassSerializerInterceptor, Controller, Post, Get, UseInterceptors, Res, Req, HttpCode, Body, UnauthorizedException, Redirect } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { Public } from "./decorator/public.decorator";
import { statusOnline } from "users/dto/update-user.dto";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TFAController {
	constructor(
		private readonly TFAService: AuthService,
		private readonly usersService: UsersService,

	) {}

	@Get("generate")
	async register(@Res() response: Response, @Req() request: any) {
		await this.usersService.turnOffTFA(request.user.sub);
		const { otpauthUrl } = await this.TFAService.generateTFASecret(request.user.users as User);
		return this.TFAService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post("turn-on")
	async turnOnTFA(
		@Req() request: any,
		@Body() TFACode: string
	) {
		const updatedUser = await this.usersService.findOne(request.user.users.id);
		const isCodeValid =
			this.TFAService.isTFACodeValid(
				TFACode,
				updatedUser.TFASecret
			);
		// if (!isCodeValid) {
			// throw new UnauthorizedException("Wrong authentication code");
		// }
		const User = await this.usersService.turnOnTFA(request.user.sub);
		return User;
	}

	@Public()
	@Post("authenticate")
	async authenticate(
		@Res({ passthrough: true }) res: Response,
		@Body() body: { id: number, TFASecret: string, TFACode: string }
	) {
		console.log(body);
		// const isCodeValid = this.TFAService.isTFACodeValid(body.TFACode, body.TFASecret);
		// if (!isCodeValid) {
			// throw new UnauthorizedException("Wrong authentication code");
		// }
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);
		res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
		const user = await this.usersService.findOne(body.id);
		const access_token = await this.TFAService.generateJwt(user);
		console.log(access_token);
		const u = await this.usersService.update(body.id, statusOnline);
		console.log(u)
		res.cookie('access_token', `${access_token}`, { expires: expirationDate }).send({status: 'ok'});
	}
}
