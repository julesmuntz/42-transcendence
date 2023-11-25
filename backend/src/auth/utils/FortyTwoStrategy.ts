import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import Strategy from 'passport-42';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {
		super({
			clientID: process.env.API_ID,
			clientSecret: process.env.API_SECRET,
			callbackURL: process.env.API_CALLBACK,
			scope: ['public'],
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		// console.log(accessToken);
		// console.log(refreshToken);
		// console.log(profile);
		const user = await this.authService.validateUser({
			username: profile.username,
			avatarPath: (profile as any)._json.image.link,
			oauth42Token: accessToken,
			email: profile.emails[0].value,
			displayName: profile.displayName,
		});
		// console.log('Validate');
		// console.log(user);
		return user || null;
	}
}
