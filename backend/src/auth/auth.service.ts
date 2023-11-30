import { Injectable } from "@nestjs/common";
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
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async login(userDetails: UserDetails) {
		//verifier avant de faire tout ca que le user n'est pas connecter !
		const user = await this.usersService.findemail(userDetails.email);
		if (!user) {
			console.log("create users !");
			return this.usersService.create(userDetails as CreateUserDto);
		} else {
			console.log("le user est deja dans la base de donne !");
			console.log(user);
			return user;
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
