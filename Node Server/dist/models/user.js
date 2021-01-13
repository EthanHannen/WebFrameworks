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
exports.getUserList = exports.delUser = exports.getUserByID = exports.validEmail = exports.toUser = exports.updateUser = exports.updatePassword = exports.createUser = exports.loadUsers = exports.User = void 0;
const email_validator_1 = __importDefault(require("email-validator"));
const message_1 = require("./message");
const jwtauth_1 = require("../utils/jwtauth");
const mysql_1 = require("../utils/mysql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const USERS = [];
// User object
class User {
    constructor(id, first, last, email, pass) {
        this.password = '';
        this.userId = id;
        this.firstName = first;
        this.lastName = last;
        this.emailAddress = email;
        this.password = pass;
    }
    // Deep copy myself without password
    sanitize() {
        let cleanUser = JSON.parse(JSON.stringify(this));
        delete cleanUser.password;
        return cleanUser;
    }
    hasValidPassword(password) {
        return bcrypt_1.default.compare(password, this.password);
    }
}
exports.User = User;
function loadUsers() {
    const query = "SELECT * FROM users";
    mysql_1.SQL.db.query(query, function (err, res) {
        if (err)
            console.log(err);
        else {
            res.forEach((u) => {
                let user = new User(u.userID, u.first, u.last, u.email, u.pass);
                USERS.push(user);
            });
        }
    });
}
exports.loadUsers = loadUsers;
function createUser(res, user) {
    bcrypt_1.default.hash(user.password, 10, (err, hash) => {
        // Await hashing function before adding user to array & db
        if (err)
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Malformed password. Please try again");
        else {
            user.password = hash;
            mysql_1.SQL.query(`INSERT INTO users 
                (userID, first, last, email, pass) 
                VALUES (
                    '${user.userId}',
                    '${user.firstName}',
                    '${user.lastName}',
                    '${user.emailAddress}',
                    '${hash}'
                );`);
            USERS.push(user);
            res.status(message_1.Status.CREATED).send(user.sanitize());
        }
    });
}
exports.createUser = createUser;
function updatePassword(res, pass, user) {
    bcrypt_1.default.hash(pass, 10, (err, hash) => {
        // Await hashing function before updating db and user object
        if (err)
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Malformed password. Please try again");
        else {
            user.password = hash;
            mysql_1.SQL.query(`UPDATE users 
                 SET password = '${hash}' 
                 WHERE userID = '${user.userId}'`);
            new message_1.Message(res, message_1.Status.OK, "Password updated");
        }
    });
}
exports.updatePassword = updatePassword;
function updateUser(res, user) {
    bcrypt_1.default.hash(user.password, 10, (err, hash) => {
        // Await hashing function before updating db and user object
        if (err)
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Malformed password. Please try again");
        else {
            user.password = hash;
            mysql_1.SQL.query(`UPDATE users 
                SET
                   first = '${user.firstName}',
                   last  = '${user.lastName}',
                   email = '${user.emailAddress}',
                   pass  = '${hash}'
               WHERE userID = '${user.userId}'`);
            let token = jwtauth_1.JWTAuth.generateWebToken(user);
            res.status(message_1.Status.OK).send({ token: token });
        }
    });
}
exports.updateUser = updateUser;
function toUser(obj) {
    return (obj.hasOwnProperty('userId') &&
        obj.hasOwnProperty('firstName') &&
        obj.hasOwnProperty('lastName') &&
        obj.hasOwnProperty('emailAddress')
        ? obj.userId : "");
}
exports.toUser = toUser;
function validEmail(email) {
    return email_validator_1.default.validate(email);
}
exports.validEmail = validEmail;
function getUserByID(id) {
    let user = USERS.find(u => u.userId === id);
    return user;
}
exports.getUserByID = getUserByID;
function delUser(user) {
    let index = USERS.findIndex(u => u.userId === user.userId);
    if (index >= 0) {
        USERS.splice(index);
        mysql_1.SQL.query(`DELETE FROM users WHERE userID = '${user.userId}'`);
        return true;
    }
    return false;
}
exports.delUser = delUser;
function getUserList() {
    const cleanUsers = [];
    USERS.forEach(u => cleanUsers.push(u.sanitize()));
    return cleanUsers;
}
exports.getUserList = getUserList;
//# sourceMappingURL=user.js.map