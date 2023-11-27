import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDetails } from "src/auth/utils/interfaces";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./utils/interfaces";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepository:
		Repository<User>,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(details: UserDetails) {
		// console.log('AuthService');
		// console.log(details);
		const user = await this.userRepository.findOneBy({
			email: details.email,
		});
		console.log(user);
		if (user) {
			console.log("User found. Already signed up.");
			return user;
		}
		console.log("User not found. Signing up.");
		const newUser = this.userRepository.create(details);
		return this.userRepository.save(newUser);
	}

	async findUser(id: number) {
		const user = await this.userRepository.findOneBy({ id });
		return user;
	}

	public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
		const token = this.jwtService.sign(payload, {
		  secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
		  expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
	  }

	async validate(payload: TokenPayload) {
		const user = await this.findUser(payload.userId);
		if (!user.isTFAEnabled) {
		  return user;
		}
		if (payload.isSecondFactorAuthenticated) {
		  return user;
		}
	  }
}
