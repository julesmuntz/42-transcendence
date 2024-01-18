import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserStatus {
	Online = 'online',
	InGame = 'ingame',
	Idle = 'idle',
	Offline = 'offline',
}

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	creationDate: Date;

	@Column({ length: 128 })
	email: string;

	@Column({ length: 32 })
	username: string;

	@Column({ default: 0 })
	elo: number;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.Offline,
	})
	status: UserStatus;

	@Column()
	avatarDefault: string;

	@Column({ nullable: true })
	avatarPath: string;

	@Column({ nullable: true })
	TFASecret: string;

	@Column({ default: false })
	isTFAEnabled: boolean;

	@Column({ length: 255, nullable: true })
	socketId: string;

}
