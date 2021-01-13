/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { User, toUser, getUserByID } from '../models/user';
import { IncomingHttpHeaders } from 'http';
import { Response } from 'express';
import { Status, Message } from '../models/message';
import jwt from 'jsonwebtoken';

// JWTAuth class adapted from Jose Gomez's project review
export class JWTAuth
{
    static SecretSalt = 'N854BFJ284JBB01OQ048DZNF77GH88BNA0Q8H1L0D3N9JAOQ0482JJ0133KZLM8M8M1N';

    static authenticateUser(res: Response, headers: IncomingHttpHeaders): User | undefined
    {
        let foundUser = undefined;

        try {
            if(headers.authorization && headers.authorization.split(' ')[0] === 'Bearer')
            {
                let user = jwt.verify(headers.authorization.split(' ')[1], this.SecretSalt) as any;
    
                if (user.UserData)
                {
                    let userID = toUser(user.UserData);
    
                    if (userID.length > 0)
                    {
                        foundUser = getUserByID(userID);
                        if (!foundUser)
                            new Message(res, Status.UNAUTHORIZED, 'Invalid user');
                    }
                    else
                        new Message(res, Status.UNAUTHORIZED, 'Malformed user data in token');
                }
                else
                    new Message(res, Status.UNAUTHORIZED, 'Malformed user data in token');
            }
            else
                new Message(res, Status.UNAUTHORIZED, 'Invalid authorization header');
        }
        catch (e) {
            console.log(e);
            new Message(res, Status.UNAUTHORIZED, 'Invalid or missing token');
        }
        finally {
            return foundUser; // Returns a user if found or undefined
        }        
    }

    // Create my web token
    static generateWebToken(user: User)
    {
        console.log(user);
        let token = jwt.sign({UserData:user}, JWTAuth.SecretSalt, {expiresIn:900, subject:user.userId});
        console.log(token);
        return token;
    }
}