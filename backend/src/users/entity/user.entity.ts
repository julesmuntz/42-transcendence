import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

enum UserStatus {
  Online = 'online',
  InGame = 'ingame',
  Idle = 'idle',
  Offline = 'offline',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  creationDate: Date;

  @Column({ length: 32 })
  name: string;

  @Column()
  elo: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Offline,
  })
  status: UserStatus;

  @Column({ length: 64 })
  avatarPath: string;

  @Column({ length: 256, nullable: true })
  oauth42Token: string;

  @Column({ length: 256, nullable: true })
  oauthGoogleToken: string;
}
