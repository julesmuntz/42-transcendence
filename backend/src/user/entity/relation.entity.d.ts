import { User } from './user.entity';
declare enum RelationType {
    Regular = "regular",
    Invited = "invited",
    Friend = "friend",
    Blocked = "blocked"
}
export declare class Relation {
    id: number;
    user1: User;
    user2: User;
    type: RelationType;
}
export {};
