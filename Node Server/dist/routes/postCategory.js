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
exports.postCategoryRouter = void 0;
const message_1 = require("../models/message");
const PostCats = __importStar(require("../models/postcategory"));
const post_1 = require("../models/post");
const jwtauth_1 = require("../utils/jwtauth");
const user_1 = require("../models/user");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const category_1 = require("../models/category");
const router = express_1.default.Router();
exports.postCategoryRouter = router;
router.use(body_parser_1.default.urlencoded({ extended: false }));
// Returns all categories related to a post
router.get('/:postID', (req, res, next) => {
    if (isNaN(+req.params.postID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else {
        let posts = PostCats.getCategoriesByPost(+req.params.postID);
        if (posts.length > 0)
            res.status(message_1.Status.OK).send(posts);
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "No post categories match that Post ID");
    }
});
// Returns all posts in a given category
router.get('/Posts/:categoryID', (req, res, next) => {
    if (isNaN(+req.params.categoryID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else {
        let posts = PostCats.getPostsByCategory(+req.params.categoryID);
        if (posts.length > 0)
            res.status(message_1.Status.OK).send(posts);
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "No post categories match that Category ID");
    }
});
// Create new post category
router.post('/:postID/:categoryID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let post = undefined;
    let category = undefined;
    let postCat = undefined;
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to create a Post Category");
    else if (isNaN(+req.params.postID) || isNaN(+req.params.categoryID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else if (!(post = post_1.getPost(+req.params.postID)))
        new message_1.Message(res, message_1.Status.NOT_FOUND, "No post exists with that Post ID");
    else if (!(category = category_1.getCategory(+req.params.categoryID)))
        new message_1.Message(res, message_1.Status.NOT_FOUND, "No category exists with that Category ID");
    else if (postCat = PostCats.getPostCategory(+req.params.postID, +req.params.categoryID))
        new message_1.Message(res, message_1.Status.CONFLICT, "A Post Category for that Post ID and Category ID already exists");
    else {
        PostCats.addPostCategory(new PostCats.PostCategory(+req.params.postID, +req.params.categoryID));
        new message_1.Message(res, message_1.Status.OK, "Post Category added");
    }
});
// Deletes post category
router.delete('/:postID/:categoryID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let postCat = undefined;
    if (!(user instanceof user_1.User))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to create a Post Category");
    else if (isNaN(+req.params.postID) || isNaN(+req.params.categoryID))
        res.status(message_1.Status.NOT_FOUND).redirect('/');
    else if (!(postCat = PostCats.getPostCategory(+req.params.postID, +req.params.categoryID)))
        new message_1.Message(res, message_1.Status.NOT_FOUND, "Post Category not found");
    else if (!post_1.isAuthor(+req.params.postID, user.userId))
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be the author of the post to delete Post Category");
    else {
        if (PostCats.deletePostCategory(postCat))
            new message_1.Message(res, message_1.Status.OK, "Post Category deleted");
        else
            new message_1.Message(res, message_1.Status.NOT_FOUND, "Post Category not found!");
    }
});
//# sourceMappingURL=postCategory.js.map