import {
	ClassSerializerInterceptor,
	Controller,
	Header,
	Post,
	Get,
	UseInterceptors,
	Res,
	UseGuards,
	Req,
	HttpCode,
	Body,
	UnauthorizedException,
} from "@nestjs/common";
import { TFAService } from "./2fa.service";
import { Response } from "express";
import { RequestWithUser } from "./utils/interfaces";
import { UsersService } from "../users/users.service";
import { TFACodeDto } from "./dto/2fa.dto";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "./guard/jwt.Guards";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TFAController {
	constructor(
		private readonly TFAService: TFAService,
		private readonly usersService: UsersService,
		private readonly authenticationService: AuthService
	) {}

	@Get("generate")
	@UseGuards(JwtAuthGuard)
	async register(@Res() response: Response, @Req() request: RequestWithUser) {
		const { otpauthUrl } = await this.TFAService.generateTFASecret(request.user);
		console.log("Generating Two Factor Authentication");
		console.log("Request User:", request.user);

		return this.TFAService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post("turn-on")
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOnTFA(
		@Req() request: RequestWithUser,
		@Body() { TFACode }: TFACodeDto
	) {
		console.log("turnOnTFA");
		console.log(request.user);
		console.log(request.body);
		const isCodeValid =
			this.TFAService.isTFACodeValid(
				TFACode,
				request.user
			);
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}
		await this.usersService.turnOnTFA(request.user.id);
	}

	@Post("authenticate")
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate(
		@Req() request: RequestWithUser,
		@Body() { TFACode }: TFACodeDto
	) {
		const isCodeValid =
			this.TFAService.isTFACodeValid(
				TFACode,
				request.user
			);
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}


		const accessTokenCookie =
			this.authenticationService.getCookieWithJwtAccessToken(
				request.user.id,
				true
			);

		request.res.setHeader("Set-Cookie", [accessTokenCookie]);

		return request.user;
	}
}
