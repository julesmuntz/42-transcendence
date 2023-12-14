import { IsEnum, IsNotEmpty } from 'class-validator';
import { RelationType } from '../entities/friend.entity';
import { User } from 'users/entities/user.entity';

export class CreateFriendDto {

	@IsNotEmpty()
	user1_id: number;

	@IsNotEmpty()
	user2_id: number;

	@IsEnum(RelationType)
	type: RelationType;
}
