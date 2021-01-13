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
exports.SQL = void 0;
const mysql_1 = __importDefault(require("mysql"));
class SQL {
    static initialize() {
        this.db = mysql_1.default.createConnection({
            host: "localhost",
            user: "testuser",
            password: "password",
            port: 3306,
            multipleStatements: true
        });
        this.db.connect((err) => {
            if (err)
                console.log(err);
            else
                console.log("Connected to MySQL database");
        });
    }
    static query(q) {
        const query = `${q}`;
        this.db.query(query, function (err, res) {
            if (err)
                console.log(err);
            return res;
        });
    }
}
exports.SQL = SQL;
//# sourceMappingURL=mysql.js.map