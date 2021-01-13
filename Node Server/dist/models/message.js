"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["OK"] = 200] = "OK";
    Status[Status["CREATED"] = 201] = "CREATED";
    Status[Status["NO_CONTENT"] = 204] = "NO_CONTENT";
    Status[Status["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    Status[Status["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Status[Status["FORBIDDEN"] = 403] = "FORBIDDEN";
    Status[Status["NOT_FOUND"] = 404] = "NOT_FOUND";
    Status[Status["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    Status[Status["CONFLICT"] = 409] = "CONFLICT";
})(Status = exports.Status || (exports.Status = {}));
class Message {
    constructor(res, status, message) {
        this.status = status.toString();
        this.message = message;
        res.status(status).send(this);
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map