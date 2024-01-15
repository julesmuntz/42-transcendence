import { Module } from '@nestjs/common';
import { FriendsGateway } from './friends.gateway';


@Module({
	imports: [],
	controllers: [],
	providers: [FriendsGateway],
})
export class FriendsModule { }
