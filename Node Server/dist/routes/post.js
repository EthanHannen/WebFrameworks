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
exports.postRouter = void 0;
const message_1 = require("../models/message");
const jwtauth_1 = require("../utils/jwtauth");
const post_1 = require("../models/post");
const user_1 = require("../models/user");
const Posts = __importStar(require("../models/post"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.postRouter = router;
router.use(body_parser_1.default.urlencoded({ extended: false }));
// Return all posts 
router.get('/', (req, res, next) => {
    res.status(message_1.Status.OK).send(Posts.getPosts());
});
// Return a single post
router.get('/:postID', (req, res, next) => {
    if (isNaN(+req.params.postID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else {
        let post = Posts.getPost(+req.params.postID);
        if (post)
            res.status(message_1.Status.OK).send(post);
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "No post exists with that Post ID");
    }
});
// Return all posts by a specific author
router.get('/User/:userID', (req, res, next) => {
    let user = user_1.getUserByID(req.params.userID);
    if (user) {
        let posts = Posts.getPostsByUser(user.userId);
        if (posts.length > 0)
            res.status(message_1.Status.OK).send(posts);
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "No posts exists for that user");
    }
    else
        new message_1.Message(res, message_1.Status.NOT_FOUND, "No user found for that User ID");
});
// Create a new post
router.post('/', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to create a post");
    else if (!req.body.title || !req.body.content)
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "A title and content must be provided to create a post");
    else {
        Posts.createPost(new Posts.Post(Posts.Post.getID(), new Date(), req.body.title, req.body.content, user.userId, req.body.headerImage, new Date()));
        new message_1.Message(res, message_1.Status.CREATED, "Post created");
    }
});
// Updates a post
router.patch('/:postID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let post = undefined;
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to update a post");
    else if (isNaN(+req.params.postID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else if (post = post_1.getPost(+req.params.postID)) {
        if (post.userId !== user.userId)
            new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You are not authorized to update that post");
        else {
            if (req.body.title)
                post.title = req.body.title;
            if (req.body.content)
                post.content = req.body.content;
            if (req.body.headerImage)
                post.headerImage = req.body.headerImage;
            post.lastUpdated = new Date();
            Posts.updatePost(post);
            new message_1.Message(res, message_1.Status.OK, "Post updated");
        }
    }
    else
        new message_1.Message(res, message_1.Status.NOT_FOUND, "No post exists with that Post ID");
});
// Deletes a post
router.delete('/:postID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let post = undefined;
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to update a post");
    else if (isNaN(+req.params.postID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else if (post = post_1.getPost(+req.params.postID)) {
        if (post.userId !== user.userId)
            new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You are not authorized to delete that post");
        else if (Posts.deletePost(post.postId))
            new message_1.Message(res, message_1.Status.NO_CONTENT, "Post deleted");
    }
    else
        new message_1.Message(res, message_1.Status.NOT_FOUND, "No post exists with that Post ID");
});
//# sourceMappingURL=post.js.map