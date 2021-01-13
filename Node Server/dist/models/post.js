"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthor = exports.deletePostsByUser = exports.deletePost = exports.updatePost = exports.getPosts = exports.getPostsByUser = exports.getPost = exports.createPost = exports.loadPosts = exports.Post = void 0;
const postcategory_1 = require("./postcategory");
const mysql_1 = require("../utils/mysql");
var POSTS = [];
// Post object
class Post {
    constructor(id, created, title, content, userId, headerImage, updated) {
        this.postId = id;
        this.createdDate = created;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = updated;
    }
    static getID() {
        return ++this.autoID;
    }
    static setID(id) {
        this.autoID = id;
    }
}
exports.Post = Post;
Post.autoID = 0; // Unique Post ID's
function loadPosts() {
    const id = "SELECT MAX(postID) AS ID from posts";
    const query = "SELECT * FROM posts ORDER BY createdDate ASC";
    mysql_1.SQL.db.query(id, function (err, res) {
        if (err)
            console.log(err);
        else
            Post.setID(res[0].ID);
    });
    mysql_1.SQL.db.query(query, function (err, res) {
        if (err)
            console.log(err);
        else {
            res.forEach((u) => {
                let post = new Post(u.postID, new Date(u.createdDate), u.title, u.content, u.userID, u.headerImage, new Date(u.lastUpdated));
                POSTS.push(post);
            });
        }
    });
}
exports.loadPosts = loadPosts;
function createPost(post) {
    mysql_1.SQL.query(`INSERT INTO posts 
        (postID, createdDate, title, content, userID, headerImage, lastUpdated) 
        VALUES(
            '${post.postId}',
            '${post.createdDate.getTime()}',
            '${post.title}',
            '${post.content}',
            '${post.userId}',
            '${post.headerImage}',
            '${post.lastUpdated.getTime()}'
        )`);
    POSTS.unshift(post);
}
exports.createPost = createPost;
function getPost(id) {
    return POSTS.find(p => p.postId === id);
}
exports.getPost = getPost;
function getPostsByUser(userId) {
    let posts = POSTS.filter(p => p.userId === userId);
    return posts;
}
exports.getPostsByUser = getPostsByUser;
function getPosts() {
    return POSTS;
}
exports.getPosts = getPosts;
function updatePost(post) {
    mysql_1.SQL.query(`UPDATE posts
            SET 
            title = '${post.title}',
            content = '${post.content}',
            headerImage = '${post.headerImage}',
            lastUpdated = '${post.lastUpdated.getTime()}' 
            WHERE postID = '${post.postId}'`);
}
exports.updatePost = updatePost;
function deletePost(id) {
    let index = POSTS.findIndex(p => p.postId === id);
    if (index >= 0) {
        mysql_1.SQL.query(`DELETE FROM posts WHERE postID = '${POSTS[index].postId}'`);
        postcategory_1.deleteByPostID(POSTS[index].postId); // Cleanup PostCategories
        POSTS.splice(index);
        return true;
    }
    return false;
}
exports.deletePost = deletePost;
function deletePostsByUser(userId) {
    let posts = POSTS.filter(p => p.userId != userId); // Build array with posts not matching userId
    if (posts.length > 0) {
        mysql_1.SQL.query(`DELETE FROM posts WHERE userID = '${userId}'`);
        POSTS = posts; // Reassign posts with filtered results
        return true;
    }
    return false;
}
exports.deletePostsByUser = deletePostsByUser;
function isAuthor(postId, userId) {
    let post = getPost(postId);
    if (post && post.userId === userId)
        return true;
    return false;
}
exports.isAuthor = isAuthor;
//# sourceMappingURL=post.js.map