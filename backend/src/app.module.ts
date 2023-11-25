import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { GamesModule } from './games/games.module';
import { ChatsModule } from './chats/chats.module';
import { ChannelsModule } from './channels/channels.module';


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
	UsersModule,
	FriendsModule,
	GamesModule,
	ChatsModule,
	ChannelsModule],
	controllers: [],
	providers: [],
})

export class AppModule {}
