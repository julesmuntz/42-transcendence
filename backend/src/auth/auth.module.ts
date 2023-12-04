import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { FortyTwoStrategy } from "./strategy/42.Strategy";
import { AuthService } from "src/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { TFAService } from "./2fa.service"
import { UsersService } from "src/users/users.service";
import { TFAController } from "./2fa.controller"
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.Strategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		ConfigModule,
		JwtModule.register({
			secret: 'your-secret-key',
			signOptions: { expiresIn: '7d' },
		  }),
	],
	controllers: [AuthController, TFAController],
	providers: [
		AuthService,
		FortyTwoStrategy,
		UsersService,
		TFAService,
		JwtStrategy
	],
})
export class AuthModule{}