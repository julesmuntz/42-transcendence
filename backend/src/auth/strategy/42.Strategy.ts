import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import Strategy from 'passport-42';
import { AuthService } from '../auth.service';
import { TFAService } from '../2fa.service';
import { UsersService } from '../../users/users.service';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly twoFactorAuthService: TFAService,
		private readonly usersService: UsersService,
	) {
		super({
			clientID: process.env.API_ID,
			clientSecret: process.env.API_SECRET,
			callbackURL: process.env.API_CALLBACK,
			scope: ['public'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		return profile;
	}
}

