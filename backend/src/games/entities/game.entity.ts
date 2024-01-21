import { User } from '../../users/entities/user.entity';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	creationDate: Date;

	@ManyToOne(() => User)
	@JoinColumn()
	user1: User;

	@ManyToOne(() => User)
	@JoinColumn()
	user2: User;

	@Column()
	score1: number;

	@Column()
	score2: number;
}
