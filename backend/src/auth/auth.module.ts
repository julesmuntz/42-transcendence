import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { FortyTwoStrategy } from "./strategy/42.Strategy";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { TFAController } from "./2fa.controller"
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.Strategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		ConfigModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '7d' },
		}),
	],
	controllers: [AuthController, TFAController],
	providers: [
		AuthService,
		FortyTwoStrategy,
		UsersService,
		JwtStrategy
	],
})
export class AuthModule { }
