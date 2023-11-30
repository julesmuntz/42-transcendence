import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { FortyTwoStrategy } from "./utils/FortyTwoStrategy";
import { AuthService } from "src/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { SessionSerializer } from "./utils/Serializer";
import { TFAService } from "./2fa.service"
import { UsersService } from "src/users/users.service";
import { TFAController } from "./2fa.controller"
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		PassportModule.register({ session: true }),
		TypeOrmModule.forFeature([User]),
		ConfigModule,
	],
	controllers: [AuthController, TFAController],
	providers: [
		AuthService,
		FortyTwoStrategy,
		SessionSerializer,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
		UsersService,
		TFAService,
		JwtService,
	],
})
export class AuthModule{}