import { Injectable, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDetails } from "./utils/interfaces";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "./utils/interfaces";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { Response } from "express";


@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async login(userDetails: UserDetails) : Promise<string | User> {
		const user = await this.usersService.findemail(userDetails.email);
		if (!user) {
			console.log("create users !");
			const usercreate = await this.usersService.create(userDetails as CreateUserDto);
			if (usercreate) {
				const payload = { sub: usercreate.id, users: usercreate };
				return this.jwtService.sign(payload);
			}
		} else {
			const payload = { sub: user.id, users: user };
			if (user.isTFAEnabled) {
				return user;
			} else {
				return this.jwtService.sign(payload);
			}
		}
	}

}
