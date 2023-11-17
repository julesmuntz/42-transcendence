import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forRoot({
	type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'user-name',
    password: 'strong-password',
    database: 'postgres',
    entities: [],
    synchronize: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
