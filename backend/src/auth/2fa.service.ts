import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { toFileStream } from "qrcode";
import { Response } from "express";

@Injectable()
export class TFAService {
	constructor(private readonly usersService: UsersService) {}

	public async generateTFASecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, "ft_transcendence", secret);
		await this.usersService.setTFASecret(secret, user.id);

		return {secret, otpauthUrl};
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public isTFACodeValid(
		TFACode: string,
		user: User
	) {
	// 	console.log("1");
	// 	console.log(TFACode);
	// 	console.log("2");
	// 	console.log(user.TFASecret);
		return authenticator.verify({
			token: TFACode,
			secret: user.TFASecret,
		});
	}
}
