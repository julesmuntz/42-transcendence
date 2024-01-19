import { Controller, Get, Post, Body, Res, Req, Patch, Param, Delete, NotFoundException, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'auth/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import { editFileName } from './file-upload.utils';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto);
	}

	@Post('upload/:id')
	@UseInterceptors(FileInterceptor('customFile', {
		storage: diskStorage({
			destination: './imgs/',
			filename: editFileName
		})
	}))
	async handleUpload(@UploadedFile() file: any, @Param('id') id: number): Promise<any> {
		await this.usersService.update(id, { avatarPath: `http://localhost:3030/users/imgs/` + file.filename });
		return {
			statusCode: 200,
			data: `http://localhost:3030/users/imgs/` + file.filename,
		}
	}

	@Public()
	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<User> {
		const user = await this.usersService.findOne(id);
		if (!user) {
			throw new NotFoundException("User does not exist !");
		} else {
			return user;
		}
	}

	@Get('search/:name')
	async search(@Param('name') name: string): Promise<User[]> {
		const user = await this.usersService.search(name);
		return user;
	}

	@Public()
	@Get('imgs/:imgpath')
	seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
		return res.sendFile(image, { root: './imgs' });
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		await this.usersService.update(id, updateUserDto);
		return {
			statusCode: 200,
		}
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
