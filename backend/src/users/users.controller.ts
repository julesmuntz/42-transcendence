import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'auth/decorator/public.decorator';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Public()
	@Post()
	async create(@Body() createUserDto: CreateUserDto) : Promise<User> {
		return this.usersService.create(createUserDto);
	}

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

	@Get('search/:name')
	async search(@Param('name') name: string) : Promise<User[]> {
		return this.usersService.search(name);
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
