import { IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
 
export class TwoFactorAuthenticationCodeDto {
  @IsString()
  twoFactorAuthenticationCode: string;
}
 
export default TwoFactorAuthenticationCodeDto;