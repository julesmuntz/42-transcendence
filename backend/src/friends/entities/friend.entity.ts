import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from "../../users/entities/user.entity";

export enum RelationType {
	Regular = 'regular',
	Invited = 'invited',
	Friend = 'friend',
	Blocked = 'blocked',
}

@Entity()
export class Friend {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	@JoinColumn()
	user1: User;

	@ManyToOne(() => User)
	@JoinColumn()
	user2: User;

	@Column({
	  type: 'enum',
	  enum: RelationType,
	  default: RelationType.Invited
	})
	type: RelationType;


	@Column({ nullable: true })
	idRoom: number;
}
