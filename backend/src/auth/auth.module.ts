import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { FortyTwoStrategy } from "./utils/FortyTwoStrategy";
import { AuthService } from "src/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { SessionSerializer } from "./utils/Serializer";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [AuthController],
	providers: [
		FortyTwoStrategy,
		SessionSerializer,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		}
	],
})
export class AuthModule{}