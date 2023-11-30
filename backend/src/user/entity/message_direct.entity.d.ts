import { User } from './user.entity';
export declare class MessageDirect {
    id: number;
    creationDate: Date;
    senderUser: User;
    recipientUser: User;
    text: string;
}
