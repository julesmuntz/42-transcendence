import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { toFileStream } from "qrcode";
import { Response } from "express";

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(private readonly usersService: UsersService) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(
			user.email,
			"AUTH_APP_NAME",
			secret
		);

		await this.usersService.setTFASecret(secret, user.id);

		return {
			secret,
			otpauthUrl,
		};
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode: string,
		user: User
	) {
		console.log(twoFactorAuthenticationCode);
		console.log(user.TFASecret);
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.TFASecret,
		});
	}
}
