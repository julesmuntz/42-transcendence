import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { FortyTwoStrategy } from "./utils/FortyTwoStrategy";
import { AuthService } from "src/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { SessionSerializer } from "./utils/Serializer";
import { TwoFactorAuthenticationService } from "src/2fa/TwoFactorAuthentication.service";
import { UsersService } from "src/users/users.service";
import { TwoFactorAuthenticationController } from "src/2fa/TwoFactorAuthentication.controller";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Module({
	imports: [TypeOrmModule.forFeature([User]), ConfigModule],
	controllers: [AuthController, TwoFactorAuthenticationController],
	providers: [
		AuthService,
		FortyTwoStrategy,
		SessionSerializer,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
		UsersService,
		TwoFactorAuthenticationService,
		JwtService,
	],
})
export class AuthModule{}