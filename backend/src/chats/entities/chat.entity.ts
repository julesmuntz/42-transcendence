import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRoom, Message, ChannelType } from '../../shared/chats.interface';

@Entity()
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 64 })
	name: string;

	@Column({ type: 'json', nullable: true })
	host: UserRoom;

	@Column({ type: 'json', nullable: true })
	users: UserRoom[];

	@Column({ type: 'json', nullable: true })
	message: Message[];

	@Column()
	channel: boolean;

	@Column({
		type: 'enum',
		enum: ChannelType,
		default: ChannelType.Public,
	})
	type: ChannelType;
}
