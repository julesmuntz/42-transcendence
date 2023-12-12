import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async findAll() : Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) : Promise<User> {
		const user = await this.usersService.findOne(id);
		if (!user) {
			throw new NotFoundException("User does not exist !");
		} else {
			return user;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) : Promise<any> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
	const user = await this.usersService.findOne(id);
	if (!user) {
		throw new NotFoundException("User does not exist !");
	} else {
		return this.usersService.delete(id);
	}
  }
}
