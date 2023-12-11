import { ClassSerializerInterceptor, Controller, Post, Get, UseInterceptors, Res, Req, HttpCode, Body, UnauthorizedException, Redirect } from "@nestjs/common";
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
		const updatedUser = await this.usersService.findOne(request.user.users.id);
		const isCodeValid =
			this.TFAService.isTFACodeValid(
				TFACode.TFACode,
				updatedUser.TFASecret
			);
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}
		await this.usersService.turnOnTFA(request.user.users.id);
		const finalUser = await this.usersService.findOne(updatedUser.id);
		return finalUser;
		// return res.redirect('http://localhost:3000');
	}

	@Public()
	@Post("authenticate")
	async authenticate(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() body: { id: number, TFASecret: string, TFACode: string }
	) {
		console.log(body);
		// const isCodeValid = this.TFAService.isTFACodeValid(body.TFACode, body.TFASecret);
		// if (!isCodeValid) {
			// throw new UnauthorizedException("Wrong authentication code");
		// }
		res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
		const user = await this.usersService.findOne(body.id);
		const access_token = await this.TFAService.generateJwt(user);
		console.log(access_token);
		res.cookie('access_token', `${access_token}`).send({status: 'ok'});
	}
}
