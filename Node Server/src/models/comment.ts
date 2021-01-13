/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Post, getPost } from '../models/post';
import { SQL } from '../utils/mysql';

var COMMENTS: Comment[] = [];

// Comment object
export class Comment {

    public commentId:   number;
    public comment:     string;
    public userId:      string;
    public postId:      number;
    public commentDate: Date;

    private static autoID: number = 0;

    constructor(
        id:          number,
        comment:     string,
        userId:      string,
        postId:      number,
        date:        Date
    ) 
    {
        this.commentId   = id;
        this.comment     = comment;
        this.userId      = userId;
        this.postId      = postId;
        this.commentDate = date;
    }

    static getID()
    {
        return ++this.autoID;
    }
    static setID(id: number)
    {
        this.autoID = id;
    }
}

export function loadComments()
{
    const id = "SELECT MAX(commentID) AS ID from comments";
    const query = "SELECT * FROM comments ORDER BY commentDate ASC";

    SQL.db.query(id, function (err: any, res: any) {
        if (err)
            console.log(err);
        else
            Comment.setID(res[0].ID);
    });
    
    SQL.db.query(query, function (err: any, res: any[]) {
        if (err) 
            console.log(err);
        else
        {
            res.forEach((u) => {
                let comment = new Comment(
                    u.commentID,
                    u.comment,
                    u.userID,
                    u.postID,
                    new Date(u.commentDate)
                )
                COMMENTS.push(comment);
            });
        }
    });
}

export function addComment(comment: Comment): boolean
{
    if (getPost(comment.postId) instanceof Post)
    {
        SQL.query(
            `INSERT INTO comments
            (commentID, comment, userID, postID, commentDate)
            VALUES(
                '${comment.commentId}',
                '${comment.comment}',
                '${comment.userId}',
                '${comment.postId}',
                '${comment.commentDate.getTime()}'
            )`
        );
        COMMENTS.unshift(comment);
        return true;
    }
    return false;
}

export function getComment(cid: number, pid: number)
{
    return COMMENTS.find(c => c.commentId == cid && c.postId == pid);
}

export function getCommentsByPost(id: number)
{
    return COMMENTS.filter(c => c.postId == id);;
}

export function updateComment(comment: Comment)
{
    SQL.query(
        `UPDATE comments 
        SET comment = '${comment.comment}' 
        WHERE commentID = '${comment.commentId}'`
    );
}

export function deleteComment(comment: Comment)
{
    let index:number = COMMENTS.findIndex(c => c.commentId === comment.commentId)

    if (index >= 0)
    {
        SQL.query(
            `DELETE FROM comments 
            WHERE commentID = '${comment.commentId}'`
        );
        COMMENTS.splice(index);
    }
}