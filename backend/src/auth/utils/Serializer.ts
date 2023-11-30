import { PassportSerializer } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";


@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(
		@Inject("AUTH_SERVICE") private readonly authService: AuthService,
		private readonly userService: UsersService
	)	{
		super();
	}

	serializeUser(user: User, done: Function) {
		console.log('serializeUser');
		// console.log(user);
		done(null, user.id);
	}

	async deserializeUser(payload: any, done: Function) {
		const user = await this.userService.findOne(payload);
		console.log('deserializeUser');
		// console.log(user);
		if (user)
			done(null, user);
		else
			done(null, null);
	}
}
