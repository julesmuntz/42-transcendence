import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ChannelType {
	Public = 'public',
	Protected = 'protected',
	Private = 'private',
}

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	creationDate: Date;

	@Column({ length: 32 })
	name: string;

	@Column({
		type: 'enum',
		enum: ChannelType,
	})
	type: ChannelType;

	@Column({ length: 256, nullable: true })
	passwordHash: string;

}
