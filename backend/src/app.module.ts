import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from './users/users.module';import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [ConfigModule.forRoot(),
  AuthModule,
	UsersModule,
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
	FriendsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
