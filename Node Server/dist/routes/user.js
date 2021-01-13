"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user_1 = require("../models/user");
const message_1 = require("../models/message");
const user_2 = require("../models/user");
const jwtauth_1 = require("../utils/jwtauth");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.userRouter = router;
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: false }));
const LETTERS_ONLY = /^[A-Za-z]+$/;
// Add User
router.post('/', (req, res, next) => {
    if (!req.body.userId)
        new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Missing username");
    else if (!req.body.firstName || !req.body.lastName)
        new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Missing first or last name");
    else if (!LETTERS_ONLY.test(req.body.firstName) || !LETTERS_ONLY.test(req.body.lastName))
        new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "First and last names should contain only letters");
    else if (!req.body.emailAddress)
        new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Missing email address");
    else if (!user_1.validEmail(req.body.emailAddress))
        new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Invalid email");
    else if (!req.body.password)
        new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Missing password");
    else if (user_2.getUserByID(req.body.userId) instanceof user_1.User)
        new message_1.Message(res, message_1.Status.CONFLICT, "User exists");
    else {
        let user = new user_1.User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
        user_1.createUser(res, user);
    }
});
// Login user and get token
router.get('/:userId/:password', (req, res, next) => {
    let user = user_2.getUserByID(req.params.userId);
    if (user instanceof user_1.User) {
        user.hasValidPassword(req.params.password).then((validPass) => {
            console.log("here");
            if (validPass) {
                let token = jwtauth_1.JWTAuth.generateWebToken(user);
                res.status(message_1.Status.OK).send({ token: token });
            }
            else
                new message_1.Message(res, message_1.Status.UNAUTHORIZED, "Invalid username or password");
        });
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "Invalid username or password");
});
// Get Current Users
router.get('/', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (user instanceof user_1.User) {
        let users = user_1.getUserList();
        res.status(message_1.Status.OK).send(users);
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to perform that action");
});
// Get Specific User
router.get('/:userId', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (user) {
        let findUser = user_2.getUserByID(req.params.userId);
        if (findUser instanceof user_1.User)
            res.status(message_1.Status.OK).send(findUser.sanitize());
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "No user found with that userId");
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to perform that action");
});
// Delete Existing User
router.delete('/:userID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to delete an account");
    else if (!(user.userId === req.params.userID)) // SHOULD USERS ONLY BE ABLE TO DELETE THEIR OWN ACCOUNTS?
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You are not authorized to delete accounts that are not your own");
    else {
        if (user_1.delUser(user))
            new message_1.Message(res, message_1.Status.NO_CONTENT, "User deleted");
        else
            new message_1.Message(res, message_1.Status.CONFLICT, "Unable to delete user");
    }
});
// Modify Existing User
router.patch('/:userID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to delete an account");
    else if (user.userId === req.params.userID) // SHOULD USERS ONLY BE ABLE TO MODIFY THEIR OWN ACCOUNTS?
     {
        if (req.body.firstName && !LETTERS_ONLY.test(req.body.firstName))
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "First name may only contain letters");
        else if (req.body.lastName && !LETTERS_ONLY.test(req.body.lastName))
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Last name may only contain letters");
        else if (req.body.emailAddress && !user_1.validEmail(req.body.emailAddress))
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Invalid email address");
        else {
            if (req.body.firstName)
                user.firstName = req.body.firstName;
            if (req.body.lastName)
                user.lastName = req.body.lastName;
            if (req.body.emailAddress)
                user.emailAddress = req.body.emailAddress;
            if (req.body.password)
                user.password = req.body.password;
            user_1.updateUser(res, user);
        }
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You are not authorized to modify accounts that are not your own");
});
//# sourceMappingURL=user.js.map