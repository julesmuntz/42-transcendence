import { Injectable, } from "@nestjs/common";
import { UserDetails } from "./utils/interfaces";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { Response } from "express";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";
import { statusOnline } from "users/dto/update-user.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) { }

	async login(userDetails: UserDetails): Promise<string | User> {
		const user = await this.usersService.findemail(userDetails.email);
		if (!user) {
			console.log("create users !");
			const usercreate = await this.usersService.create(userDetails as CreateUserDto);
			if (usercreate) {
				return this.generateJwt(usercreate);
			}
		} else {
			if (user.isTFAEnabled) {
				return user;
			} else {
				const u = await this.usersService.update(user.id, statusOnline);
				console.log(u)
				return this.generateJwt(user);
			}
		}
	}

	async logout(user: User): Promise<void> {

	}

	public async generateTFASecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, "ft_transcendence", secret);
		const users = await this.usersService.setTFASecret(secret, user.id);
		console.log(users);
		console.log(secret);
		return { secret, otpauthUrl };
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public isTFACodeValid(TFACode: string, TFASecret: string) {
		return authenticator.verify({ token: TFACode, secret: TFASecret });
	}

	async generateJwt(user: User): Promise<string> {
		const payload = { sub: user.id, users: user };
		return (this.jwtService.sign(payload));
	}

}
