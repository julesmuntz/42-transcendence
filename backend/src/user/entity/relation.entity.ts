import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

enum RelationType {
  Regular = 'regular',
  Invited = 'invited',
  Friend = 'friend',
  Blocked = 'blocked',
}

@Entity('relation')
export class Relation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @Column({
    type: 'enum',
    enum: RelationType,
  })
  type: RelationType;
}
