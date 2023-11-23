import { IsEnum, IsInt } from 'class-validator';
import { RelationType } from '../entities/friend.entity';

export class CreateFriendDto {
	@IsInt()
	user1Id: number;

	@IsInt()
	user2Id: number;

	@IsEnum(RelationType)
	type: RelationType;
}
