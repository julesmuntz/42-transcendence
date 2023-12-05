import { Injectable, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDetails } from "src/auth/utils/interfaces";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./utils/interfaces";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "src/users/dto/create-user.dto";


@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async login(userDetails: UserDetails) {
		//verifier avant de faire tout ca que le user n'est pas connecter !
		const user = await this.usersService.findemail(userDetails.email);
		if (!user) {
			console.log("create users !");
			const usercreate = await this.usersService.create(userDetails as CreateUserDto);
			if (usercreate) {
				const payload = { sub: usercreate.id, user: usercreate };
				return this.jwtService.sign(payload);
			}
		} else {
			const payload = { sub: user.id, user: user };
			if (user.isTFAEnabled) {

				//2fa authenticate

				return this.jwtService.sign(payload);
			} else {
				console.log("2fa non active !");

				return this.jwtService.sign(payload);
			}
		}
	}

	public getCookieWithJwtAccessToken(
		userId: number,
		isSecondFactorAuthenticated = false
	) {
		const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
			expiresIn: `${this.configService.get(
				"JWT_ACCESS_TOKEN_EXPIRATION_TIME"
			)}s`,
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
			"JWT_ACCESS_TOKEN_EXPIRATION_TIME"
		)}`;
	}

	async validate(payload: TokenPayload) {
		const user = await this.usersService.findOne(payload.userId);

		if (!user.isTFAEnabled) {
			return user;
		}
		if (payload.isSecondFactorAuthenticated) {
			return user;
		}
	}
}
