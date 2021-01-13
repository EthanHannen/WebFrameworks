export class User {
    userId:       string = '';
    firstName:    string = '';
    lastName:     string = '';
    emailAddress: string = '';
    password:     string = '';
}

export class UserToken {
    token: string = '';
    UserData: User;
    iat: number;
    exp: number;
    sub: string;
}