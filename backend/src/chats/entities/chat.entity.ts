import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'timestamptz' })
	creationDate: Date;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'sender_user_id' })
	senderUser: User;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'recipient_user_id' })
	recipientUser: User;

	@Column({ length: 1024 })
	text: string;
}
