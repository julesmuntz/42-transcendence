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

	@CreateDateColumn({ type: 'timestamptz'})
	creationDate: Date;

	@Column({ length: 32})
	name: string;

	@Column({default: 0})
	elo: number;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.Offline,
	})
	status: UserStatus;

	@Column({ length: 64, default: 'intra'})
	avatarPath: string;

	@Column({ length: 256, nullable: true })
	oauth42Token: string;

	@Column({ length: 256, nullable: true })
	oauthGoogleToken: string;
}
