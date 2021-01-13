/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Status, Message } from '../models/message';
import * as PostCats from '../models/postcategory';
import { getPost, isAuthor } from '../models/post';
import { JWTAuth } from '../utils/jwtauth';
import { User } from '../models/user';
import bodyParser from 'body-parser';
import express from 'express';
import { getCategory } from '../models/category';

const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));

// Returns all categories related to a post
router.get('/:postID', (req,res,next)=>{

    if (isNaN(+req.params.postID))
        res.status(Status.NOT_FOUND).redirect('/');
    else
    {
        let posts = PostCats.getCategoriesByPost(+req.params.postID);

        if (posts.length > 0)
            res.status(Status.OK).send(posts);
        else
            new Message(res, Status.NOT_FOUND, "No post categories match that Post ID");
    }
});

// Returns all posts in a given category
router.get('/Posts/:categoryID', (req,res,next)=>{

    if (isNaN(+req.params.categoryID))
        res.status(Status.NOT_FOUND).redirect('/');
    else
    {
        let posts = PostCats.getPostsByCategory(+req.params.categoryID);

        if (posts.length > 0)
            res.status(Status.OK).send(posts);
        else
            new Message(res, Status.NOT_FOUND, "No post categories match that Category ID");
    }
});

// Create new post category
router.post('/:postID/:categoryID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let post = undefined;
    let category = undefined;
    let postCat = undefined;

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to create a Post Category");
    else if (isNaN(+req.params.postID) || isNaN(+req.params.categoryID))
        res.status(Status.NOT_FOUND).redirect('/');
    else if (!(post = getPost(+req.params.postID)))
        new Message(res, Status.NOT_FOUND, "No post exists with that Post ID");
    else if (!(category = getCategory(+req.params.categoryID)))
        new Message(res, Status.NOT_FOUND, "No category exists with that Category ID");
    else if (postCat = PostCats.getPostCategory(+req.params.postID, +req.params.categoryID))
        new Message(res, Status.CONFLICT, "A Post Category for that Post ID and Category ID already exists");
    else
    {
        PostCats.addPostCategory(
            new PostCats.PostCategory (
                +req.params.postID,
                +req.params.categoryID
            )
        );
        new Message(res, Status.OK, "Post Category added");
    }
});

// Deletes post category
router.delete('/:postID/:categoryID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let postCat = undefined;

    if (!(user instanceof User))
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to create a Post Category");
    else if (isNaN(+req.params.postID) || isNaN(+req.params.categoryID))
        res.status(Status.NOT_FOUND).redirect('/');
    else if (!(postCat = PostCats.getPostCategory(+req.params.postID, +req.params.categoryID)))
        new Message(res, Status.NOT_FOUND, "Post Category not found");
    else if (!isAuthor(+req.params.postID, user.userId))
        new Message(res, Status.UNAUTHORIZED, "You must be the author of the post to delete Post Category");            
    else
    {
        if (PostCats.deletePostCategory(postCat))
            new Message(res, Status.OK, "Post Category deleted");
        else
            new Message(res, Status.NOT_FOUND, "Post Category not found!");
    }
});

export {router as postCategoryRouter};