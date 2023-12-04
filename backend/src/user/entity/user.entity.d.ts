declare enum UserStatus {
    Online = "online",
    InGame = "ingame",
    Idle = "idle",
    Offline = "offline"
}
export declare class User {
    id: number;
    creationDate: Date;
    name: string;
    elo: number;
    status: UserStatus;
    avatarPath: string;
    oauth42Token: string;
    oauthGoogleToken: string;
}
export {};
