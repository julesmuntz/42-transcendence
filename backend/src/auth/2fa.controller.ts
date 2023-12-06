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
import { UsersService } from "../users/users.service";
import { TFACodeDto } from "./dto/2fa.dto";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { Public } from "./decorator/public.decorator";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TFAController {
	constructor(
		private readonly TFAService: TFAService,
		private readonly usersService: UsersService,
		private readonly authenticationService: AuthService
	) {}

	//si la 2fa n'est pas encore activer !
	@Get("generate")
	async register(@Res() response: Response, @Req() request: any) {
		console.log("Request User:", request.user.users);
		const { otpauthUrl } = await this.TFAService.generateTFASecret(request.user.users as User);
		// console.log("Generating Two Factor Authentication");
		// console.log("Request User:", request);

		return this.TFAService.pipeQrCodeStream(response, otpauthUrl);
	}

	// @Post("turn-on")
	// @HttpCode(200)
	// async turnOnTFA(
	// 	@Req() request: RequestWithUser,
	// 	@Body() { TFACode }: TFACodeDto
	// ) {
	// 	console.log("turnOnTFA");
	// 	console.log(request.user);
	// 	console.log(request.body);
	// 	const isCodeValid =
	// 		this.TFAService.isTFACodeValid(
	// 			TFACode,
	// 			request.user
	// 		);
	// 	if (!isCodeValid) {
	// 		throw new UnauthorizedException("Wrong authentication code");
	// 	}
	// 	await this.usersService.turnOnTFA(request.user.id);
	// }

	@Public()
	@Post("authenticate")
	@HttpCode(200)
	async authenticate(
		@Req() request: any,
		@Body()  TFACode : TFACodeDto,

	) {

		// const isCodeValid =
		// 	this.TFAService.isTFACodeValid(
		// 		TFACode,
		// 		request.user.user
		// 	);
		// if (!isCodeValid) {
		// 	throw new UnauthorizedException("Wrong authentication code");
		// }


		return request.user;
	}
}
