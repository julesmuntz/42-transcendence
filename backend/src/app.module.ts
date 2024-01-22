import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { GamesModule } from './games/games.module';
import { ChatsModule } from './chats/chats.module';
import { ChannelsModule } from './channels/channels.module';
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.Guards';
import { SocketsService } from 'sockets.service';
import { AppGateway } from 'app.gateway';
import { PongModule } from 'pong/pong.module';
import { PongService } from 'pong/pong.service';
import { GamesService } from 'games/games.service';
import { Game } from 'games/entities/game.entity';
import { UsersService } from "users/users.service";
import { User } from "users/entities/user.entity";

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
		FriendsModule,
		GamesModule,
		ChannelsModule,
		ChatsModule,
		PongModule,
		UsersModule,
		TypeOrmModule.forFeature([Game]),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		AppGateway,
		SocketsService,
		GamesService,
		PongService,
		UsersService,
	],
})

export class AppModule { }
