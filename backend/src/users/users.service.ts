import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async create(createUserDto: CreateUserDto) : Promise<User> {
		const newuser = this.userRepository.create(createUserDto);
		return this.userRepository.save(newuser);
	}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findemail(email: string) : Promise<User> {
		return this.userRepository.findOne({where: {email}});
	}

	async findOne(id: number) : Promise<User> {
		return this.userRepository.findOne({where: {id}});

	}

	async search(name: string) : Promise<User[]> {
		return this.userRepository.find({where: {username: Like(`${name}%`)}});
	}

	async update(id: number, updateUserDto: UpdateUserDto) : Promise<User> {
		await this.userRepository.update(id, updateUserDto);
		return this.userRepository.findOne({ where: { id } });
	}

	async delete(id: number) : Promise<void> {
		await this.userRepository.delete(id);
	}

	async setTFASecret(secret: string, id: number) : Promise<User> {
		await this.userRepository.update(id, { TFASecret: secret });
		return this.userRepository.findOne({ where: { id } });
	}

	async turnOnTFA(id: number) : Promise<User>{
		this.userRepository.update(id, { isTFAEnabled: true});
		return this.userRepository.findOne({ where: { id } });
	}

	async turnOffTFA(id: number) : Promise<User>{
		this.userRepository.update(id, { isTFAEnabled: false});
		return this.userRepository.findOne({ where: { id } });
	}

	async findOneBySocketId(socketId: string) : Promise<User> {
		return this.userRepository.findOne({ where: { socketId } });
	}
}
