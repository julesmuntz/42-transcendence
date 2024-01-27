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
import { InvitationGateway } from 'pong/invitation.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
	imports: [ConfigModule.forRoot(),
	TypeOrmModule.forRoot({
		type: process.env.POSTGRES_TYPE as any,
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT) || 5432,
		username: process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_DATABASE_PASSWORD,
		database: process.env.POSTGRES_DATABASE,
		entities: [__dirname + '/**/*.entity{.ts,.js}'],
		synchronize: true,
	}),
	ServeStaticModule.forRoot({
		rootPath: '/frontend/build',
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
		InvitationGateway,
	],
})

export class AppModule { }
