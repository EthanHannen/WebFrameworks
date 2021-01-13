"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteByPostID = exports.deleteByCategory = exports.deletePostCategory = exports.addPostCategory = exports.getPostsByCategory = exports.getCategoriesByPost = exports.getPostCategory = exports.loadPostCats = exports.PostCategory = void 0;
const category_1 = require("../models/category");
const post_1 = require("../models/post");
const mysql_1 = require("../utils/mysql");
var POST_CATEGORIES = [];
// PostCategory object
class PostCategory {
    constructor(categoryId, postId) {
        this.categoryId = categoryId;
        this.postId = postId;
    }
}
exports.PostCategory = PostCategory;
function loadPostCats() {
    const query = "SELECT * FROM post_category";
    mysql_1.SQL.db.query(query, function (err, res) {
        if (err)
            console.log(err);
        else {
            res.forEach((u) => {
                let post = new PostCategory(u.categoryID, u.postID);
                POST_CATEGORIES.push(post);
            });
        }
    });
}
exports.loadPostCats = loadPostCats;
function getPostCategory(pid, cid) {
    return POST_CATEGORIES.find(p => p.postId === pid && p.categoryId === cid);
}
exports.getPostCategory = getPostCategory;
function getCategoriesByPost(id) {
    let cats = POST_CATEGORIES.filter(c => c.postId === id);
    console.log(cats);
    var catsArray = [];
    cats.forEach(c => {
        let cat = category_1.getCategory(c.categoryId);
        if (cat)
            catsArray.push(cat);
    });
    return catsArray;
}
exports.getCategoriesByPost = getCategoriesByPost;
function getPostsByCategory(id) {
    let posts = POST_CATEGORIES.filter(p => p.categoryId === id);
    var postsArray = [];
    posts.forEach(p => {
        let post = post_1.getPost(p.postId);
        if (post)
            postsArray.push(post);
    });
    return postsArray;
}
exports.getPostsByCategory = getPostsByCategory;
function addPostCategory(postCat) {
    mysql_1.SQL.query(`INSERT INTO post_category 
        (categoryID, postID)
        VALUES(
            ${postCat.categoryId}, 
            ${postCat.postId})`);
    POST_CATEGORIES.push(postCat);
}
exports.addPostCategory = addPostCategory;
function deletePostCategory(postCat) {
    let index = POST_CATEGORIES.findIndex(p => p.postId === postCat.postId &&
        p.categoryId === postCat.categoryId);
    if (index >= 0) {
        mysql_1.SQL.query(`DELETE FROM post_category 
            WHERE categoryID = ${postCat.categoryId} 
            AND postID = ${postCat.postId}`);
        POST_CATEGORIES.splice(index);
        return true;
    }
    return false;
}
exports.deletePostCategory = deletePostCategory;
function deleteByCategory(cid) {
    let cats = POST_CATEGORIES.filter(p => p.categoryId != cid); // Build array with posts not matching cid
    mysql_1.SQL.query(`DELETE FROM post_category
         WHERE categoryID = ${cid}`);
    POST_CATEGORIES = cats; // Reassign with filtered results
}
exports.deleteByCategory = deleteByCategory;
function deleteByPostID(pid) {
    let cats = POST_CATEGORIES.filter(p => p.postId != pid); // Build array with posts not matching pid
    mysql_1.SQL.query(`DELETE FROM post_category
         WHERE postID = ${pid}`);
    POST_CATEGORIES = cats; // Reassign with filtered results
}
exports.deleteByPostID = deleteByPostID;
//# sourceMappingURL=postcategory.js.map