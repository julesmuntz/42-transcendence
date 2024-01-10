import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ChannelMemberService } from '../Service/channel-member.service';
import { CreateChannelMemberDto } from '../dto/create-channel-member.dto';
import { ChannelMember } from '../entities/channel-member.entity';
import { UpdateChannelMemberDto } from '../dto/update-channel-member.dto';

@Controller('channel-member')
export class ChannelMemberController {
	constructor(private readonly channelmemberService: ChannelMemberService) { }

	@Post()
	async create(@Body() CreateChannelMemberDto: CreateChannelMemberDto): Promise<ChannelMember> {
		return this.channelmemberService.create(CreateChannelMemberDto);
	}

	@Get()
	async findall(): Promise<ChannelMember[]> {
		return this.channelmemberService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<ChannelMember> {
		const channelmember = await this.channelmemberService.findOne(id);
		if (!channelmember) {
			throw new NotFoundException("Channel member does not exit !");
		} else {
			return channelmember;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChannelMemberDto: UpdateChannelMemberDto): Promise<any> {
		return this.channelmemberService.update(id, updateChannelMemberDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const channel = await this.channelmemberService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Channel member does not exit !");
		} else {
			return this.channelmemberService.delete(id);
		}
	}
}
