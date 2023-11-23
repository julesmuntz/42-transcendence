import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDetails } from "src/auth/utils/types";
import { User } from "src/users/entities/user.entity"; 
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepository:
		Repository<User>,
	) {}

	validateUser(details: UserDetails) {
		console.log('AuthService');
		console.log(details);
		// this.userRepository.
	}
}