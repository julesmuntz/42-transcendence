import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChannelMemberRole, ChannelMemberAccess, ChannelMemberPermission } from '../entities/channel-menber.entity';
import { User } from 'users/entities/user.entity';
import { Channel } from 'channels/entities/channel.entity';

export class CreateChannelMenberDto {
	@IsNotEmpty()
	channel: Channel;

	@IsNotEmpty()
	user: User;

	@IsEnum(ChannelMemberRole)
	role: ChannelMemberRole;

	@IsEnum(ChannelMemberAccess)
	access: ChannelMemberAccess;

	@IsEnum(ChannelMemberPermission)
	permission: ChannelMemberPermission;

}
