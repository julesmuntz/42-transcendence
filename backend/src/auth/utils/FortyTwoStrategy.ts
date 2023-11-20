import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import Strategy from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID: API_ID,
			clientSecret: API_SECRET,
			callbackURL: API_CALLBACK,
			scope: ['public'],
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		console.log(accessToken);
		console.log(refreshToken);
		console.log(profile);
	}
}
