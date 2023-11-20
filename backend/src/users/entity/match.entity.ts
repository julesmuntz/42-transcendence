import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  creationDate: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @Column()
  score1: number;

  @Column()
  score2: number;
}
