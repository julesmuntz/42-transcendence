import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelMenberDto } from './create-channel-menber.dto';

export class UpdateChannelMenberDto extends PartialType(CreateChannelMenberDto) {}