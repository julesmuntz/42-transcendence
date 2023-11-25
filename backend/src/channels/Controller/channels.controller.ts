import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ChannelsService } from '../Service/channels.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { Channel } from '../entities/channel.entity';

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post()
	async create(@Body() createChannelDto: CreateChannelDto) : Promise<Channel> {
		return this.channelsService.create(createChannelDto);
	}

	@Get()
	async findAll() : Promise<Channel[]> {
		return this.channelsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) : Promise<Channel> {
		const channel = await this.channelsService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Channel does not exit !");
		} else {
			return  channel;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) : Promise<any> {
		return this.channelsService.update(id, updateChannelDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const channel = await this.channelsService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Channel does not exit !");
		} else {
			return this.channelsService.delete(+id);
		}
	}
}
