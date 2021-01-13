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
/*
* This assignment uses MySQL to store data.
* Please create a MySQL user with a username of 'testuser' and a password of 'password'.
* User must have rights to create, read, and modify the database
* Or you can update the connection info in utils/mysql.ts
* A database will automatically be deployed by the program once an account has been created.
*/
const category_1 = require("./routes/category");
const comment_1 = require("./routes/comment");
const post_1 = require("./routes/post");
const postCategory_1 = require("./routes/postCategory");
const user_1 = require("./routes/user");
const mysql_1 = require("./utils/mysql");
const dataloader_1 = require("./utils/dataloader");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
let app = express_1.default();
mysql_1.SQL.initialize();
dataloader_1.DataLoader.checkDatabase();
app.use(cors_1.default({ credentials: true, origin: true }));
app.options('*', cors_1.default({ credentials: true, origin: true }));
app.use(body_parser_1.default.json());
app.use('/Categories', category_1.categoryRouter);
app.use('/Comments', comment_1.commentRouter);
app.use('/Posts', post_1.postRouter);
app.use('/PostCategory', postCategory_1.postCategoryRouter);
app.use('/Users', user_1.userRouter);
// Send root
app.get('/', (req, res, next) => {
    res.status(200).send("Main page");
});
// Not found, redirect to root
app.use((req, res, next) => {
    res.status(404).redirect('/');
});
const server = http_1.default.createServer(app);
server.listen(3000);
//# sourceMappingURL=index.js.map