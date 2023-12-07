import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from "../../users/entities/user.entity";
import { Channel } from "./channel.entity";

@Entity()
export class MessageChannel {
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

	@Column({ length: 1024 })
	text: string;
}
