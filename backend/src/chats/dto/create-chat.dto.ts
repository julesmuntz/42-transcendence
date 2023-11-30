import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateChatDto {
	@IsNumber()
	@IsNotEmpty()
	senderUserId: number;

	@IsNumber()
	@IsNotEmpty()
	recipientUserId: number;

	@IsString()
	@MaxLength(1024)
	text: string;
}
