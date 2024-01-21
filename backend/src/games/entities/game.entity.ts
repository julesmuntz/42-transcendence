import { User } from '../../users/entities/user.entity';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	creationDate: Date;

	@Column()
	user1Id: number;

	@Column()
	user2Id: number;

	@Column()
	user1Name: string;

	@Column()
	user2Name: string;

	@Column()
	score1: number;

	@Column()
	score2: number;
}
