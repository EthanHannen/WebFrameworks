/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Category, getCategory } from '../models/category';
import { Post, getPost } from '../models/post';
import { SQL } from '../utils/mysql';

var POST_CATEGORIES: PostCategory[] = [];

// PostCategory object
export class PostCategory {
    
    categoryId: number;
    postId:     number;

    constructor(
        categoryId: number, 
        postId:     number, 
    )
    {
        this.categoryId = categoryId;
        this.postId     = postId;
    }
}

export function loadPostCats()
{
    const query = "SELECT * FROM post_category";

    SQL.db.query(query, function (err: any, res: any[]) {
        if (err)
            console.log(err);
        else
        {
            res.forEach((u) => {
                let post = new PostCategory(
                    u.categoryID,
                    u.postID,
                )
                POST_CATEGORIES.push(post);
            });   
        }
    });
}

export function getPostCategory(pid: number, cid: number)
{
    return POST_CATEGORIES.find(p=>p.postId === pid && p.categoryId === cid);
}

export function getCategoriesByPost(id: number)
{
    let cats = POST_CATEGORIES.filter(c => c.postId === id);
    var catsArray: Category[] = [];

    cats.forEach(c => {
        let cat = getCategory(c.categoryId);
        if (cat) catsArray.push(cat);
    });
    
    return catsArray;
}

export function getPostsByCategory(id: number)
{
    let posts = POST_CATEGORIES.filter(p => p.categoryId === id);
    var postsArray: Post[] = [];

    posts.forEach(p => {
        let post = getPost(p.postId);
        if (post) postsArray.push(post);
    });
    
    return postsArray;
}

export function addPostCategory(postCat: PostCategory)
{
    SQL.query(
        `INSERT INTO post_category 
        (categoryID, postID)
        VALUES(
            ${postCat.categoryId}, 
            ${postCat.postId})`
    );
    POST_CATEGORIES.push(postCat);
}

export function deletePostCategory(postCat: PostCategory)
{
    let index:number = POST_CATEGORIES.findIndex(
            p => 
            p.postId === postCat.postId &&
            p.categoryId === postCat.categoryId
        );

    if (index >= 0)
    {
        SQL.query(
            `DELETE FROM post_category 
            WHERE categoryID = ${postCat.categoryId} 
            AND postID = ${postCat.postId}`
        );
        POST_CATEGORIES.splice(index);
        return true;
    }
    return false;
}

export function deleteByCategory(cid: number)
{
    let cats = POST_CATEGORIES.filter(p => p.categoryId != cid); // Build array with posts not matching cid

    SQL.query(
        `DELETE FROM post_category
         WHERE categoryID = ${cid}`
    );

    POST_CATEGORIES = cats; // Reassign with filtered results
}

export function deleteByPostID(pid: number)
{
    let cats = POST_CATEGORIES.filter(p => p.postId != pid); // Build array with posts not matching pid

    SQL.query(
        `DELETE FROM post_category
         WHERE postID = ${pid}`
    );

    POST_CATEGORIES = cats; // Reassign with filtered results
}