import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from "src/users/entities/user.entity";
import { Channel } from "./channel.entity";

enum ChannelMemberRole {
	Regular = 'regular',
	Admin = 'admin',
	Owner = 'owner',
}

enum ChannelMemberAccess {
	Regular = 'regular',
	Gone = 'gone',
	Kicked = 'kicked',
	Banned = 'banned',
}

enum ChannelMemberPermission {
	Regular = 'regular',
	Muted = 'muted',
}

@Entity()
export class ChannelMember {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'timestamptz' })
	creationDate: Date;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Channel, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;

	@Column({
		type: 'enum',
		enum: ChannelMemberRole,
		default: ChannelMemberRole.Regular,
	})
	role: ChannelMemberRole;

	@Column({
		type: 'enum',
		enum: ChannelMemberAccess,
		default: ChannelMemberAccess.Regular,
	})
	access: ChannelMemberAccess;

	@Column({
		type: 'enum',
		enum: ChannelMemberPermission,
		default: ChannelMemberPermission.Regular,
	})
	permission: ChannelMemberPermission;
}