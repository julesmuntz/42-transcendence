import { User } from './user.entity';
export declare class Match {
    id: number;
    creationDate: Date;
    user1: User;
    user2: User;
    score1: number;
    score2: number;
}
