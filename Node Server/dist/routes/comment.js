"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const message_1 = require("../models/message");
const post_1 = require("../models/post");
const Comments = __importStar(require("../models/comment"));
const jwtauth_1 = require("../utils/jwtauth");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.commentRouter = router;
router.use(body_parser_1.default.urlencoded({ extended: false }));
// Returns all comments for a given post
router.get('/:postID', (req, res, next) => {
    let comments = Comments.getCommentsByPost(+req.params.postID);
    if (comments.length > 0)
        res.status(message_1.Status.OK).send(comments);
    else
        new message_1.Message(res, message_1.Status.NOT_FOUND, "No comments found for that Post ID");
});
// Creates new comment for a existing post
router.post('/:postID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (isNaN(+req.params.postID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else if (user) {
        let posted = Comments.addComment(new Comments.Comment(Comments.Comment.getID(), req.body.comment, user.userId, +req.params.postID, new Date()));
        if (posted)
            new message_1.Message(res, message_1.Status.OK, "Commented posted");
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "Post not found");
    }
});
// Modifies an existing comment
router.patch('/:postID/:commentID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let comment = undefined;
    if (user) {
        if (isNaN(+req.params.postID))
            res.status(message_1.Status.NOT_FOUND).redirect('/');
        else if (isNaN(+req.params.commentID))
            res.status(message_1.Status.NOT_FOUND).redirect('/');
        else if (!(comment = Comments.getComment(+req.params.commentID, +req.params.postID)))
            new message_1.Message(res, message_1.Status.NOT_FOUND, "Comment does not exist");
        else if (comment.userId !== user.userId)
            new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You are not the author of that comment");
        else if (!req.body.comment)
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "New conent must be provided to update an existing comment");
        else if (!(post_1.getPost(comment.postId) instanceof post_1.Post))
            new message_1.Message(res, message_1.Status.NOT_FOUND, "A post does not exist for that comment");
        else {
            comment.comment = req.body.comment;
            Comments.updateComment(comment);
            new message_1.Message(res, message_1.Status.OK, "Commented updated");
        }
    }
});
// Deletes an existing comment
router.delete('/:postID/:commentID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let comment = Comments.getComment(+req.params.commentID, +req.params.postID);
    if (user) {
        if (!comment)
            new message_1.Message(res, message_1.Status.NOT_FOUND, "Comment does not exist");
        else {
            let post = post_1.getPost(comment.postId);
            if (!post)
                new message_1.Message(res, message_1.Status.NOT_FOUND, "A post was not found for that comment");
            else {
                if (comment.userId !== user.userId && post.userId !== user.userId)
                    new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You are not authorized to delete that comment");
                else {
                    Comments.deleteComment(comment);
                    new message_1.Message(res, message_1.Status.OK, "Commented deleted");
                }
            }
        }
    }
});
// Returns an existing comment
router.get('/:postID/:commentID', (req, res, next) => {
    let comment = Comments.getComment(+req.params.commentID, +req.params.postID);
    if (comment instanceof Comments.Comment)
        res.status(message_1.Status.OK).send(comment);
    else
        new message_1.Message(res, message_1.Status.NOT_FOUND, "Comment not found");
});
//# sourceMappingURL=comment.js.map