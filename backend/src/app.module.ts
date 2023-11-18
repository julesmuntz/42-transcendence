import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { Relation } from './user/entity/relation.entity';
import { MessageDirect } from './user/entity/message_direct.entity';
import { Match } from './user/entity/match.entity';


@Module({
  imports: [TypeOrmModule.forRoot({
	type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'user-name',
    password: 'strong-password',
    database: 'postgres',
    entities: [User, Relation, MessageDirect, Match],
    synchronize: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
