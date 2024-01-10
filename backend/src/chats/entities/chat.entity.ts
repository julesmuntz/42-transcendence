import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserRoom, Message } from '../../shared/chats.interface';

@Entity()
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 64})
	name: string;

	@Column({ type: 'json' , nullable: true})
	host: UserRoom;

	@Column({ type: 'json' , nullable: true})
	users: UserRoom[];

	@Column({ type: 'json', nullable: true })
	message: Message[];

	@Column()
	channel: boolean;
}
