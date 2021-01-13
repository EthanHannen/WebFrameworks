"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsByPost = exports.getComment = exports.addComment = exports.loadComments = exports.Comment = void 0;
const post_1 = require("../models/post");
const mysql_1 = require("../utils/mysql");
var COMMENTS = [];
// Comment object
class Comment {
    constructor(id, comment, userId, postId, date) {
        this.commentId = id;
        this.comment = comment;
        this.userId = userId;
        this.postId = postId;
        this.commentDate = date;
    }
    static getID() {
        return ++this.autoID;
    }
    static setID(id) {
        this.autoID = id;
    }
}
exports.Comment = Comment;
Comment.autoID = 0;
function loadComments() {
    const id = "SELECT MAX(commentID) AS ID from comments";
    const query = "SELECT * FROM comments ORDER BY commentDate ASC";
    mysql_1.SQL.db.query(id, function (err, res) {
        if (err)
            console.log(err);
        else
            Comment.setID(res[0].ID);
    });
    mysql_1.SQL.db.query(query, function (err, res) {
        if (err)
            console.log(err);
        else {
            res.forEach((u) => {
                let comment = new Comment(u.commentID, u.comment, u.userID, u.postID, new Date(u.commentDate));
                COMMENTS.push(comment);
            });
        }
    });
}
exports.loadComments = loadComments;
function addComment(comment) {
    if (post_1.getPost(comment.postId) instanceof post_1.Post) {
        mysql_1.SQL.query(`INSERT INTO comments
            (commentID, comment, userID, postID, commentDate)
            VALUES(
                '${comment.commentId}',
                '${comment.comment}',
                '${comment.userId}',
                '${comment.postId}',
                '${comment.commentDate.getTime()}'
            )`);
        COMMENTS.unshift(comment);
        return true;
    }
    return false;
}
exports.addComment = addComment;
function getComment(cid, pid) {
    return COMMENTS.find(c => c.commentId == cid && c.postId == pid);
}
exports.getComment = getComment;
function getCommentsByPost(id) {
    return COMMENTS.filter(c => c.postId == id);
    ;
}
exports.getCommentsByPost = getCommentsByPost;
function updateComment(comment) {
    mysql_1.SQL.query(`UPDATE comments 
        SET comment = '${comment.comment}' 
        WHERE commentID = '${comment.commentId}'`);
}
exports.updateComment = updateComment;
function deleteComment(comment) {
    let index = COMMENTS.findIndex(c => c.commentId === comment.commentId);
    if (index >= 0) {
        mysql_1.SQL.query(`DELETE FROM comments 
            WHERE commentID = '${comment.commentId}'`);
        COMMENTS.splice(index);
    }
}
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.js.map