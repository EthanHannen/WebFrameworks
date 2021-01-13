/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import emailValidator from 'email-validator';
import { Message, Status } from './message';
import { JWTAuth } from '../utils/jwtauth';
import { SQL } from '../utils/mysql';
import { Response } from 'express';
import bcrypt from 'bcrypt';

const USERS: User[] = [];

// User object
export class User {

    userId:       string;
    firstName:    string;
    lastName:     string;
    emailAddress: string;
    password:     string = '';

    constructor(
        id:    string,
        first: string, 
        last:  string, 
        email: string,
        pass:  string
    )
    {
        this.userId       = id;
        this.firstName    = first;
        this.lastName     = last;
        this.emailAddress = email;
        this.password     = pass;
    }

    // Deep copy myself without password
    sanitize()
    {
        let cleanUser = JSON.parse(JSON.stringify(this));
        delete cleanUser.password;
        return cleanUser;
    }

    hasValidPassword(password:string)
    {
        return bcrypt.compare(password, this.password);
    }
}

export function loadUsers()
{
    const query = "SELECT * FROM users";
    SQL.db.query(query, function (err: any, res: any[]) {
        if (err) 
            console.log(err);
        else
        {
            res.forEach((u) => {
                let user = new User(
                    u.userID,
                    u.first,
                    u.last,
                    u.email,
                    u.pass
                )
                USERS.push(user);
            });

        }
    });
}

export function createUser(res: Response, user: User)
{
    bcrypt.hash(user.password, 10, (err, hash)=> {
        // Await hashing function before adding user to array & db
        if (err)
            new Message(res, Status.NOT_ACCEPTABLE, "Malformed password. Please try again");
        else
        {
            user.password = hash;
            SQL.query(
                `INSERT INTO users 
                (userID, first, last, email, pass) 
                VALUES (
                    '${user.userId}',
                    '${user.firstName}',
                    '${user.lastName}',
                    '${user.emailAddress}',
                    '${hash}'
                );`
            );
            USERS.push(user);
            res.status(Status.CREATED).send(user.sanitize());
        }
    });
}

export function updatePassword(res: Response, pass: string, user: User)
{
    bcrypt.hash(pass, 10, (err, hash)=> {
        // Await hashing function before updating db and user object
        if (err)
            new Message(res, Status.NOT_ACCEPTABLE, "Malformed password. Please try again");
        else
        {
            user.password = hash;
            SQL.query(
                `UPDATE users 
                 SET password = '${hash}' 
                 WHERE userID = '${user.userId}'`
            );
            new Message(res, Status.OK, "Password updated");
        }
    });
}

export function updateUser(res: Response, user: User)
{
    bcrypt.hash(user.password, 10, (err, hash)=> {
        // Await hashing function before updating db and user object
        if (err)
            new Message(res, Status.NOT_ACCEPTABLE, "Malformed password. Please try again");
        else
        {
            user.password = hash;
            SQL.query(
                `UPDATE users 
                SET
                   first = '${user.firstName}',
                   last  = '${user.lastName}',
                   email = '${user.emailAddress}',
                   pass  = '${hash}'
               WHERE userID = '${user.userId}'`
            );
            let token = JWTAuth.generateWebToken(user);
            res.status(Status.OK).send({token:token});
        }
    });
}

export function toUser(obj:any): string
{
    return (
        obj.hasOwnProperty('userId') &&
        obj.hasOwnProperty('firstName') &&
        obj.hasOwnProperty('lastName') &&
        obj.hasOwnProperty('emailAddress') 
        ? obj.userId : ""
    )
}

export function validEmail(email:string)
{
    return emailValidator.validate(email);
}

export function getUserByID(id:string): User | undefined
{
    let user = USERS.find(u=>u.userId===id);
    return user;
}

export function delUser(user:User): boolean
{
    let index:number = USERS.findIndex(u => u.userId === user.userId)

    if (index >= 0)
    {
        USERS.splice(index);
        SQL.query(`DELETE FROM users WHERE userID = '${user.userId}'`);
        return true;
    }
    return false;
}

export function getUserList()
{
    const cleanUsers: any = [];
    USERS.forEach(u => cleanUsers.push(u.sanitize()));
    return cleanUsers;
}