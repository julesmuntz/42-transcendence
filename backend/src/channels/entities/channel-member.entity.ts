import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from "../../users/entities/user.entity";
import { Channel } from "./channel.entity";

export enum ChannelMemberRole {
	Regular = 'regular',
	Admin = 'admin',
	Owner = 'owner',
}

export enum ChannelMemberAccess {
	Regular = 'regular',
	Banned = 'banned',
}

export enum ChannelMemberPermission {
	Regular = 'regular',
	Muted = 'muted',
}

@Entity()
export class ChannelMember {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	creationDate: Date;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;

	@ManyToOne(() => Channel, { onDelete: 'CASCADE' })
	@JoinColumn()
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
