import { Controller, NotFoundException, Get, Post, Patch,Param, Body, Delete } from '@nestjs/common';
import { MessageChannelService } from '../Service/message-channel.service';
import { MessageChannel } from '../entities/message-channel.entity';
import { CreateMessageChannelDto } from '../dto/create-message-channel.dto';
import { UpdateMessageChannelDto } from '../dto/update-message-channel.dto';

@Controller('message-channel')
export class MessageChannelController {
	constructor(private readonly messagechannelService: MessageChannelService) {}

	@Post()
	async create(@Body() createMessageChannelDto: CreateMessageChannelDto) : Promise<MessageChannel> {
		return this.messagechannelService.create(createMessageChannelDto);
	}

	@Get()
	async findAll() : Promise<MessageChannel[]> {
		return this.messagechannelService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) : Promise<MessageChannel> {
		const messagechannel = await this.messagechannelService.findOne(id);
		if (!messagechannel) {
			throw new NotFoundException("Message channel does not exit !");
		} else {
			return  messagechannel;
		}
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateMessageChannelDto: UpdateMessageChannelDto) : Promise<any> {
		return this.messagechannelService.update(id, updateMessageChannelDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		const channel = await this.messagechannelService.findOne(id);
		if (!channel) {
			throw new NotFoundException("Message channel does not exit !");
		} else {
			return this.messagechannelService.delete(id);
		}
	}
}
