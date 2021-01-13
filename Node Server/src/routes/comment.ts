/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Status, Message } from '../models/message';
import { getPost, Post } from '../models/post';
import * as Comments from '../models/comment';
import { JWTAuth } from '../utils/jwtauth';
import bodyParser from 'body-parser';
import express from 'express';

const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));

// Returns all comments for a given post
router.get('/:postID', (req,res,next)=>{

    let comments = Comments.getCommentsByPost(+req.params.postID);
    
    if (comments.length > 0)
        res.status(Status.OK).send(comments);
    else
        new Message(res, Status.NOT_FOUND, "No comments found for that Post ID");
});

// Creates new comment for a existing post
router.post('/:postID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (isNaN(+req.params.postID))
        res.status(Status.NOT_FOUND).redirect('/');
    else if (user)
    {
        let posted = Comments.addComment(
            new Comments.Comment(
                Comments.Comment.getID(),
                req.body.comment, 
                user.userId, 
                +req.params.postID,
                new Date()
            )
        );
    
        if (posted)
            new Message(res, Status.OK, "Commented posted");
        else
            new Message(res, Status.NOT_FOUND, "Post not found");
    }
});

// Modifies an existing comment
router.patch('/:postID/:commentID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let comment = undefined;

    if (user)
    {
        if (isNaN(+req.params.postID))
            res.status(Status.NOT_FOUND).redirect('/');
        else if (isNaN(+req.params.commentID))
            res.status(Status.NOT_FOUND).redirect('/');
        else if(!(comment = Comments.getComment(+req.params.commentID, +req.params.postID)))
            new Message(res, Status.NOT_FOUND, "Comment does not exist");
        else if(comment.userId !== user.userId)
            new Message(res, Status.UNAUTHORIZED, "You are not the author of that comment");
        else if (!req.body.comment)
            new Message(res, Status.NOT_ACCEPTABLE, "New conent must be provided to update an existing comment")
        else if (!(getPost(comment.postId) instanceof Post))
            new Message(res, Status.NOT_FOUND, "A post does not exist for that comment");
        else
        {
            comment.comment = req.body.comment;
            Comments.updateComment(comment)
            new Message(res, Status.OK, "Commented updated");
        }
    }
});

// Deletes an existing comment
router.delete('/:postID/:commentID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let comment = Comments.getComment(+req.params.commentID, +req.params.postID);

    if (user)
    {
        if(!comment)
            new Message(res, Status.NOT_FOUND, "Comment does not exist");
        else
        {
            let post = getPost(comment.postId);

            if (!post)
                new Message(res, Status.NOT_FOUND, "A post was not found for that comment");
            else
            {
                if(comment.userId !== user.userId && post.userId !== user.userId)
                    new Message(res, Status.UNAUTHORIZED, "You are not authorized to delete that comment");
                else
                {
                    Comments.deleteComment(comment);
                    new Message(res, Status.OK, "Commented deleted");
                }
            }
        }
    }
});

// Returns an existing comment
router.get('/:postID/:commentID', (req,res,next)=>{

    let comment = 
        Comments.getComment(
            +req.params.commentID, 
            +req.params.postID
        );
    
    if (comment instanceof Comments.Comment)
        res.status(Status.OK).send(comment);
    else
        new Message(res, Status.NOT_FOUND, "Comment not found");
});

export {router as commentRouter};