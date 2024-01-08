import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelMemberDto } from './create-channel-member.dto';

export class UpdateChannelMemberDto extends PartialType(CreateChannelMemberDto) {}