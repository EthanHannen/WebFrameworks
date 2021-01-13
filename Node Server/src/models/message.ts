/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Response } from 'express';

export enum Status
{
    OK             = 200,
    CREATED        = 201,
    NO_CONTENT     = 204,
    BAD_REQUEST    = 400,
    UNAUTHORIZED   = 401,
    FORBIDDEN      = 403,
    NOT_FOUND      = 404,
    NOT_ACCEPTABLE = 406,
    CONFLICT       = 409,
}

export class Message {
    status: string;
    message: string;
    constructor(res:Response, status: number, message: string)
    {
        this.status = status.toString();
        this.message = message;
        res.status(status).send(this);
    }
}