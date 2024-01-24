import { ClassSerializerInterceptor, Controller, Post, Get, UseInterceptors, Res, Req, Body, UnauthorizedException, Redirect } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { Public } from "./decorator/public.decorator";
import { statusOnline } from "users/dto/update-user.dto";
import { ok } from "assert";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TFAController {
	constructor(
		private readonly TFAService: AuthService,
		private readonly usersService: UsersService,

	) { }

	@Get("generate")
	async register(@Res() response: Response, @Req() request: any) {
		// await this.usersService.turnOffTFA(request.user.sub);
		const { otpauthUrl } = await this.TFAService.generateTFASecret(request.user.users as User);
		return this.TFAService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post("turn-on")
	async turnOnTFA(
		@Req() request: any,
		@Body() body: { TFACode: string }
	) {
		const updatedUser = await this.usersService.findOne(request.user.sub);
		const isCodeValid =
			await this.TFAService.isTFACodeValid(
				body.TFACode,
				updatedUser.TFASecret
			);
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}

		const User = await this.usersService.turnOnTFA(request.user.sub);
		User.isTFAEnabled = true;
		return User;
	}

	@Public()
	@Post("authenticate")
async authenticate(
  @Res({ passthrough: true }) res: Response,
  @Body() body: { id: number, TFACode: string }
) {
	const userTFA = await this.usersService.findTFASecret(body.id);
	if (userTFA == undefined)
		throw new UnauthorizedException("User not found");
    const isCodeValid = this.TFAService.isTFACodeValid(body.TFACode, userTFA);
	const requestOrigin = res.req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);

    if (!isCodeValid) {
		console.log("Wrong authentication code");
      throw new UnauthorizedException("Wrong authentication code");
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const user = await this.usersService.findOne(body.id);
    const access_token = await this.TFAService.generateJwt(user);
    const u = await this.usersService.update(body.id, statusOnline);

    res.cookie('access_token', `${access_token}`, { httpOnly: false, sameSite: "strict", expires: expirationDate });
	res.status(200).json({ status: 'ok', id: u.id }); // Send a JSON response
    return null; // Return null to ensure that NestJS doesn't try to send an additional response
}



	@Post("turn-off")
	async turnOffTFA(
		@Req() request: any,
	) {
		const User = await this.usersService.turnOffTFA(request.user.sub);
		return User;
	}

}
