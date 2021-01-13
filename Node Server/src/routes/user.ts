/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { createUser, delUser, User, getUserList, validEmail, updateUser} from '../models/user';
import { Status, Message } from '../models/message';
import { getUserByID } from '../models/user';
import { JWTAuth } from '../utils/jwtauth';
import bodyParser from 'body-parser';
import express from 'express';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const LETTERS_ONLY: RegExp = /^[A-Za-z]+$/;

// Add User
router.post('/', (req,res,next)=>{
 
    if (!req.body.userId)
        new Message(res, Status.NOT_ACCEPTABLE, "Missing username");
    else if (!req.body.firstName || !req.body.lastName)
        new Message(res, Status.NOT_ACCEPTABLE, "Missing first or last name");
    else if (!LETTERS_ONLY.test(req.body.firstName) || !LETTERS_ONLY.test(req.body.lastName))
        new Message(res, Status.NOT_ACCEPTABLE, "First and last names should contain only letters");
    else if (!req.body.emailAddress)
        new Message(res, Status.NOT_ACCEPTABLE, "Missing email address");
    else if (!validEmail(req.body.emailAddress))
        new Message(res, Status.NOT_ACCEPTABLE, "Invalid email");
    else if (!req.body.password)
        new Message(res, Status.NOT_ACCEPTABLE, "Missing password");
    else if (getUserByID(req.body.userId) instanceof User)
        new Message(res, Status.CONFLICT, "User exists");
    else
    {
        let user = new User(
            req.body.userId,
            req.body.firstName,
            req.body.lastName,
            req.body.emailAddress,
            req.body.password
        );
        createUser(res, user);
    }
});

// Login user and get token
router.get('/:userId/:password', (req,res,next)=>{

    let user = getUserByID(req.params.userId);

    if (user instanceof User)
    {
        user.hasValidPassword(req.params.password).then((validPass)=>
        {
            console.log("here");
            if (validPass)
            {
                let token = JWTAuth.generateWebToken(user!);
                res.status(Status.OK).send({token:token});
            }
            else
                new Message(res, Status.UNAUTHORIZED, "Invalid username or password");
        });
    }
    else
        new Message(res, Status.UNAUTHORIZED, "Invalid username or password");
});

// Get Current Users
router.get('/', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (user instanceof User)
    {
        let users = getUserList();
        res.status(Status.OK).send(users);
    }
    else
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to perform that action");
});

// Get Specific User
router.get('/:userId', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (user)
    {
        let findUser = getUserByID(req.params.userId);

        if (findUser instanceof User)
            res.status(Status.OK).send(findUser.sanitize());
        else
            new Message(res, Status.NOT_FOUND, "No user found with that userId");
    }
    else
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to perform that action");
});

// Delete Existing User
router.delete('/:userID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to delete an account");
    else if (!(user.userId === req.params.userID)) // SHOULD USERS ONLY BE ABLE TO DELETE THEIR OWN ACCOUNTS?
        new Message(res, Status.UNAUTHORIZED, "You are not authorized to delete accounts that are not your own");
    else
    {
        if (delUser(user))
            new Message(res, Status.NO_CONTENT, "User deleted");
        else
            new Message(res, Status.CONFLICT, "Unable to delete user");
    }
});

// Modify Existing User
router.patch('/:userID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to delete an account");
    else if (user.userId === req.params.userID) // SHOULD USERS ONLY BE ABLE TO MODIFY THEIR OWN ACCOUNTS?
    {
        if (req.body.firstName && !LETTERS_ONLY.test(req.body.firstName))
            new Message(res, Status.NOT_ACCEPTABLE, "First name may only contain letters");
        else if (req.body.lastName && !LETTERS_ONLY.test(req.body.lastName))
            new Message(res, Status.NOT_ACCEPTABLE, "Last name may only contain letters");
        else if (req.body.emailAddress && !validEmail(req.body.emailAddress))
            new Message(res, Status.NOT_ACCEPTABLE, "Invalid email address");
        else
        {
            if (req.body.firstName)
                user.firstName = req.body.firstName;
            if (req.body.lastName)
                user.lastName = req.body.lastName;
            if (req.body.emailAddress)
                user.emailAddress = req.body.emailAddress;
            if (req.body.password)
                user.password = req.body.password;
            updateUser(res, user);
        }
    }
    else
        new Message(res, Status.UNAUTHORIZED, "You are not authorized to modify accounts that are not your own");
});

export { router as userRouter };