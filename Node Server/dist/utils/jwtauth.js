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
exports.JWTAuth = void 0;
const user_1 = require("../models/user");
const message_1 = require("../models/message");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWTAuth class adapted from Jose Gomez's project review
class JWTAuth {
    static authenticateUser(res, headers) {
        let foundUser = undefined;
        try {
            if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
                let user = jsonwebtoken_1.default.verify(headers.authorization.split(' ')[1], this.SecretSalt);
                if (user.UserData) {
                    let userID = user_1.toUser(user.UserData);
                    if (userID.length > 0) {
                        foundUser = user_1.getUserByID(userID);
                        if (!foundUser)
                            new message_1.Message(res, message_1.Status.UNAUTHORIZED, 'Invalid user');
                    }
                    else
                        new message_1.Message(res, message_1.Status.UNAUTHORIZED, 'Malformed user data in token');
                }
                else
                    new message_1.Message(res, message_1.Status.UNAUTHORIZED, 'Malformed user data in token');
            }
            else
                new message_1.Message(res, message_1.Status.UNAUTHORIZED, 'Invalid authorization header');
        }
        catch (e) {
            console.log(e);
            new message_1.Message(res, message_1.Status.UNAUTHORIZED, 'Invalid or missing token');
        }
        finally {
            return foundUser; // Returns a user if found or undefined
        }
    }
    // Create my web token
    static generateWebToken(user) {
        console.log(user);
        let token = jsonwebtoken_1.default.sign({ UserData: user }, JWTAuth.SecretSalt, { expiresIn: 900, subject: user.userId });
        console.log(token);
        return token;
    }
}
exports.JWTAuth = JWTAuth;
JWTAuth.SecretSalt = 'N854BFJ284JBB01OQ048DZNF77GH88BNA0Q8H1L0D3N9JAOQ0482JJ0133KZLM8M8M1N';
//# sourceMappingURL=jwtauth.js.map