import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';

export class FortyTwoStrategy extends PassportStrategy(Strategy) {

}