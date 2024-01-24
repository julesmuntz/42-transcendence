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
import { DataSource } from "typeorm";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private dataSources : DataSource,
	) { }

	async randomString(): Promise<string> {
		let string = "";
		const possible = "0123456789";
		for (let i = 0; i < 8; i++)
			string += possible.charAt(Math.floor(Math.random() * possible.length));
		const users = await this.dataSources.manager.findOne(User, { where: {username: string} })
			if (users)
				return this.randomString();
		return "user" + string;
	}

	async login(userDetails: UserDetails): Promise<string | User> {
		const user = await this.usersService.findemail(userDetails.email);
		if (!user) {
			userDetails.avatarPath = userDetails.avatarDefault;
			const userExist = await this.dataSources.manager.findOne(User, { where: { username: userDetails.username } });
			if (userExist) {
				userDetails.username = await this.randomString();
			}
			const usercreate = await this.usersService.create(userDetails as CreateUserDto);
			if (usercreate) {
				return this.generateJwt(usercreate);
			}
		} else {
			if (user.isTFAEnabled) {
				return user;
			} else {
				const u = await this.usersService.update(user.id, statusOnline);
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
		return { secret, otpauthUrl };
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public isTFACodeValid(TFACode: string, TFASecret: string) {
		return authenticator.verify({ token: TFACode, secret: TFASecret });
	}

	async generateJwt(user: User): Promise<string> {
		user.TFASecret = null;
		const payload = { sub: user.id, users: user };
		return (this.jwtService.sign(payload));
	}

}
