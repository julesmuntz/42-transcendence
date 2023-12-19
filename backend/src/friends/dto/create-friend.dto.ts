import { IsEnum, IsNotEmpty } from 'class-validator';
import { RelationType } from '../entities/friend.entity';
import { User } from 'users/entities/user.entity';


export class CreateFriendDto {

	@IsNotEmpty()
	user1: User;

	@IsNotEmpty()
	user2: User;

	@IsEnum(RelationType)
	type: RelationType;

}
