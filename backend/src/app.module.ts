import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { GamesModule } from './games/games.module';
import { ChatsModule } from './chats/chats.module';
import { ChannelsModule } from './channels/channels.module';
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.Guards';
import { SocketsService } from 'sockets.service';
import { AppGateway } from 'app.gateway';
import { ChannelsGateway } from 'channels/channels.gateway';

@Module({
	imports: [ConfigModule.forRoot(),
	TypeOrmModule.forRoot({
		type: process.env.TYPE as any,
		host: process.env.HOST,
		port: parseInt(process.env.PORT) || 5432,
		username: process.env.USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE,
		entities: [__dirname + '/**/*.entity{.ts,.js}'],
		synchronize: true,
	}),
		AuthModule,
		UsersModule,
		FriendsModule,
		GamesModule,
		ChatsModule,
		ChannelsModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		AppGateway,
		SocketsService,
	],
})

export class AppModule { }
