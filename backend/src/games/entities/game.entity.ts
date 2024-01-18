import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'timestamptz' })
	creationDate: Date;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({
		name: 'user1Id',
	 })
	user1: User;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({
		name: 'user2Id',
	 })
	user2: User;

	@Column()
	score1: number;

	@Column()
	score2: number;
}
