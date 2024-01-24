import { Controller, Get, Post, Body, Res, Req, Patch, Param, Delete, NotFoundException, BadRequestException, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
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
	async handleUpload(@UploadedFile(
		// new ParseFilePipeBuilder()
		// 	.addFileTypeValidator({
		// 		fileType: 'jpeg',
		// 	})
		// 	.addMaxSizeValidator({
		// 		maxSize: 200000
		// 	})
		// 	.build({
		// 		errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		// 	}),
	) file: any, @Param('id') id: string, @Req() request): Promise<any> {
		if (request.user.sub !== parseInt(id))
			return {
				statusCode: 401,
			};
		await this.usersService.update(parseInt(id), { avatarPath: `http://localhost:3030/users/imgs/` + file.filename });
		return {
			statusCode: 200,
			data: `http://localhost:3030/users/imgs/` + file.filename,
		}
	}

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
		if (user === undefined) {
			throw new NotFoundException("User does not exist !");
		}
		return user;
	}

	@Public()
	@Get('imgs/:imgpath')
	seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
		return res.sendFile(image, { root: './imgs' });
	}


	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() request): Promise<any> {
		if (request.user.sub !== parseInt(id))
			return {
				statusCode: 401,
			};
		const user = await this.usersService.update(parseInt(id), updateUserDto);
		if (user)
			return {
				statusCode: 200,
			}
		else
			return {
				statusCode: 400,
			}
	}

	// @Delete(':id')
	// async delete(@Param('id') id: number) {
	// 	const user = await this.usersService.findOne(id);
	// 	if (!user) {
	// 		throw new NotFoundException("User does not exist !");
	// 	} else {
	// 		return this.usersService.delete(id);
	// 	}
	// }
}
