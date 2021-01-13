/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import sql, { Connection } from 'mysql';

export class SQL {

    static db: Connection;

    static initialize()
    {
        this.db = sql.createConnection({
            host: "localhost",
            user: "testuser",
            password: "password",
            port: 3306,
            multipleStatements: true
        });
            
        this.db.connect((err: any)=>{
            if (err) 
                console.log(err);
            else
                console.log("Connected to MySQL database");
        });
    }

    static query(q: string)
    {
        const query = `${q}`;
        this.db.query(query, function (err: any, res: any) {
            if (err) console.log(err);
            return res;
        });
    }
}