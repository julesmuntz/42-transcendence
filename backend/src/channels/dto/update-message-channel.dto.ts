import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageChannelDto } from './create-message-channel.dto';

export class UpdateMessageChannelDto extends PartialType(CreateMessageChannelDto) {}