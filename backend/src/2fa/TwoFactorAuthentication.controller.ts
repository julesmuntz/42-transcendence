import {
	ClassSerializerInterceptor,
	Controller,
	Header,
	Post,
	UseInterceptors,
	Res,
	UseGuards,
	Req,
	HttpCode,
	Body,
	UnauthorizedException
} from "@nestjs/common";
import { TwoFactorAuthenticationService } from "./TwoFactorAuthentication.service";
import { Response } from "express";
import { FortyTwoAuthGuard } from "src/auth/utils/Guards";
import { RequestWithUser } from "src/auth/utils/interfaces";
import { UsersService } from "src/users/users.service";
import { TwoFactorAuthenticationCodeDto } from "./dto/TwoFactorAuthenticationCode.dto"
import { AuthService } from "src/auth/auth.service";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly usersService: UsersService,
		private readonly authenticationService: AuthService
	) {}

	@Post("generate")
	@UseGuards(FortyTwoAuthGuard)
	async register(@Res() response: Response, @Req() request: RequestWithUser) {
		const { otpauthUrl } =
			await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
				request.user
			);

		return this.twoFactorAuthenticationService.pipeQrCodeStream(
			response,
			otpauthUrl
		);
	}

	@Post("turn-on")
	@HttpCode(200)
	@UseGuards(FortyTwoAuthGuard)
	async turnOnTwoFactorAuthentication(
		@Req() request: RequestWithUser,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto
	) {
		const isCodeValid =
			this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode,
				request.user
			);
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code");
		}
		await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(FortyTwoAuthGuard)
	async authenticate(
	  @Req() request: RequestWithUser,
	  @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
	) {
	  const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode, request.user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
   
	  const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
   
	  request.res.setHeader('Set-Cookie', [accessTokenCookie]);
   
	  return request.user;
	}
}
