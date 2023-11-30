import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ChannelMemberService } from '../Service/channel-member.service';
import { CreateChannelMenberDto } from '../dto/create-channel-menber.dto';
import { ChannelMember } from '../entities/channel-menber.entity';
import { UpdateChannelMenberDto } from '../dto/update-channel-menber.dto';

@Controller('channel-member')
export class ChannelMemberController {
	constructor(private readonly channelmenberService: ChannelMemberService) {}

	@Post()
	async create(@Body() createChannelMenberDto: CreateChannelMenberDto) : Promise<ChannelMember> {
		return this.channelmenberService.create(createChannelMenberDto);
	}

	@Get()
	async findall() : Promise<ChannelMember[]> {
		return this.channelmenberService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id : number) : Promise<ChannelMember> {
		const channelmenber = await this.channelmenberService.findOne(id);
		if(!channelmenber) {
			throw new NotFoundException("Channel menber does not exit !");
		} else {
			return channelmenber;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChannelMenberDto: UpdateChannelMenberDto) : Promise<any> {
		return this.channelmenberService.update(id, updateChannelMenberDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const channel = await this.channelmenberService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Channel menber does not exit !");
		} else {
			return this.channelmenberService.delete(id);
		}
	}
}
