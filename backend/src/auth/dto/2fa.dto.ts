import { IsString } from 'class-validator';

export class TFACodeDto {
  @IsString()
  TFACode: string;
}

export default TFACodeDto;