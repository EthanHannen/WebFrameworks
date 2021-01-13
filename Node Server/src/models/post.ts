/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { deleteByPostID } from "./postcategory";
import { SQL } from "../utils/mysql";

var POSTS: Post[] = [];

// Post object
export class Post {

    postId:      number;
    createdDate: Date;
    title:       string;
    content:     string;
    userId:      string;
    headerImage: string;
    lastUpdated: Date;

    private static autoID: number = 0; // Unique Post ID's

    constructor(
        id:          number,
        created:     Date,
        title:       string, 
        content:     string, 
        userId:      string,
        headerImage: string,
        updated:     Date
    )
    {
        this.postId      = id;
        this.createdDate = created;
        this.title       = title;
        this.content     = content;
        this.userId      = userId;
        this.headerImage = headerImage;
        this.lastUpdated = updated;
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

export function loadPosts()
{
    const id = "SELECT MAX(postID) AS ID from posts";
    const query = "SELECT * FROM posts ORDER BY createdDate ASC";

    SQL.db.query(id, function (err: any, res: any) {
        if (err)
            console.log(err);
        else
            Post.setID(res[0].ID);
    });

    SQL.db.query(query, function (err: any, res: any[]) {
        if (err) 
            console.log(err);
        else
        {
            res.forEach((u) => {
                let post = new Post(
                    u.postID,
                    new Date(u.createdDate),
                    u.title,
                    u.content,
                    u.userID,
                    u.headerImage,
                    new Date(u.lastUpdated)
                )
                POSTS.push(post);
            });
        }
    });
}

export function createPost(post: Post)
{
    SQL.query(
        `INSERT INTO posts 
        (postID, createdDate, title, content, userID, headerImage, lastUpdated) 
        VALUES(
            '${post.postId}',
            '${post.createdDate.getTime()}',
            '${post.title}',
            '${post.content}',
            '${post.userId}',
            '${post.headerImage}',
            '${post.lastUpdated.getTime()}'
        )`
    );
    POSTS.unshift(post);
}

export function getPost(id: number)
{
    return POSTS.find(p => p.postId === id);
}

export function getPostsByUser(userId: string)
{
    let posts = POSTS.filter(p => p.userId === userId);
    return posts;
}

export function getPosts()
{
    return POSTS;
}

export function updatePost(post: Post)
{
    SQL.query(
        `UPDATE posts
            SET 
            title = '${post.title}',
            content = '${post.content}',
            headerImage = '${post.headerImage}',
            lastUpdated = '${post.lastUpdated.getTime()}' 
            WHERE postID = '${post.postId}'`
    );
}

export function deletePost(id: number): boolean
{
    let index:number = POSTS.findIndex(p => p.postId === id)

    if (index >= 0)
    {
        SQL.query(`DELETE FROM posts WHERE postID = '${POSTS[index].postId}'`);
        deleteByPostID(POSTS[index].postId); // Cleanup PostCategories
        POSTS.splice(index);
        return true;
    }
    return false;
}

export function deletePostsByUser(userId: string): boolean
{
    let posts = POSTS.filter(p => p.userId != userId); // Build array with posts not matching userId

    if (posts.length > 0)
    {
        SQL.query(`DELETE FROM posts WHERE userID = '${userId}'`);
        POSTS = posts; // Reassign posts with filtered results
        return true;
    }
    return false;
}

export function isAuthor(postId: number, userId: string)
{
    let post = getPost(postId);

    if (post && post.userId === userId)
        return true;
    return false;    
}