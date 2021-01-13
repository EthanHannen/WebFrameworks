/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

/*
* This assignment uses MySQL to store data.
* Please create a MySQL user with a username of 'testuser' and a password of 'password'.
* User must have rights to create, read, and modify the database
* Or you can update the connection info in utils/mysql.ts
* A database will automatically be deployed by the program once an account has been created.
*/

import { categoryRouter } from './routes/category';
import { commentRouter } from './routes/comment';
import { postRouter } from './routes/post';
import { postCategoryRouter } from './routes/postCategory';
import { userRouter } from './routes/user';
import { SQL } from './utils/mysql';
import { DataLoader } from './utils/dataloader';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';

let app = express();

SQL.initialize();
DataLoader.checkDatabase();

app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));

app.use(bodyParser.json());
app.use('/Categories', categoryRouter);
app.use('/Comments', commentRouter);
app.use('/Posts', postRouter);
app.use('/PostCategory', postCategoryRouter);
app.use('/Users', userRouter);

// Send root
app.get('/', (req,res,next)=>{ // Root
    res.status(200).send("Main page");
});

// Not found, redirect to root
app.use((req,res,next)=>{ // Unknown url
    res.status(404).redirect('/');
});

const server = http.createServer(app);
server.listen(3000);