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
	username: string;

	@Column({default: 0})
	elo: number;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.Offline,
	})
	status: UserStatus;

	@Column({ length: 128, default: 'intra'})
	avatarPath: string;

	@Column({ length: 256, nullable: true })
	oauth42Token: string;

	@Column({ length: 256, nullable: true })
	oauthGoogleToken: string;

	@Column({ length: 128})
	email: string;

	@Column({ length: 128})
	displayName: string;
}
