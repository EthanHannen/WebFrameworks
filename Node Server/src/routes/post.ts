/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Status, Message } from '../models/message';
import { JWTAuth } from '../utils/jwtauth';
import { getPost } from '../models/post';
import { getUserByID, User } from '../models/user';
import * as Posts from '../models/post';
import bodyParser from 'body-parser';
import express from 'express';

const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));

// Return all posts 
router.get('/', (req,res,next)=>{
    res.status(Status.OK).send(Posts.getPosts());
});

// Return a single post
router.get('/:postID', (req,res,next)=>{

    if(isNaN(+req.params.postID))
        res.status(Status.NOT_FOUND).redirect('/');
    else
    {
        let post = Posts.getPost(+req.params.postID);

        if (post)
            res.status(Status.OK).send(post);
        else
            new Message(res, Status.NOT_FOUND, "No post exists with that Post ID");
    }
});

// Return all posts by a specific author
router.get('/User/:userID', (req,res,next)=>{

    let user = getUserByID(req.params.userID);

    if (user)
    {
        let posts = Posts.getPostsByUser(user.userId);

        if (posts.length > 0)
            res.status(Status.OK).send(posts);
        else
            new Message(res, Status.NOT_FOUND, "No posts exists for that user");
    }
    else
        new Message(res, Status.NOT_FOUND, "No user found for that User ID");
});

// Create a new post
router.post('/', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to create a post");
    else if (!req.body.title || !req.body.content)
        new Message(res, Status.UNAUTHORIZED, "A title and content must be provided to create a post");
    else
    {
        Posts.createPost(new Posts.Post(
            Posts.Post.getID(),
            new Date(),
            req.body.title,
            req.body.content,
            user.userId,
            req.body.headerImage,
            new Date()
        ));
        new Message(res, Status.CREATED, "Post created");
    }
});

// Updates a post
router.patch('/:postID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let post = undefined;

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to update a post");
    else if(isNaN(+req.params.postID))
        res.status(Status.NOT_FOUND).redirect('/');
    else if (post = getPost(+req.params.postID))
    {
        if (post.userId !== user.userId)
            new Message(res, Status.UNAUTHORIZED, "You are not authorized to update that post");
        else
        {
            if (req.body.title)
                post.title = req.body.title;
            if (req.body.content)
                post.content = req.body.content;
            if (req.body.headerImage)
                post.headerImage = req.body.headerImage;

            post.lastUpdated = new Date();
            Posts.updatePost(post);
            new Message(res, Status.OK, "Post updated");
        }
    }
    else
        new Message(res, Status.NOT_FOUND, "No post exists with that Post ID");
});

// Deletes a post
router.delete('/:postID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let post = undefined;

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to update a post");
    else if(isNaN(+req.params.postID))
        res.status(Status.NOT_FOUND).redirect('/');
    else if (post = getPost(+req.params.postID))
    {
        if (post.userId !== user.userId)
            new Message(res, Status.UNAUTHORIZED, "You are not authorized to delete that post");
        else if (Posts.deletePost(post.postId))
            new Message(res, Status.NO_CONTENT, "Post deleted");
    }
    else
        new Message(res, Status.NOT_FOUND, "No post exists with that Post ID");
});

export {router as postRouter};