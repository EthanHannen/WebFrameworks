/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { loadCategories } from '../models/category';
import { loadComments } from '../models/comment';
import { loadPosts } from '../models/post';
import { loadPostCats } from '../models/postcategory';
import { loadUsers } from '../models/user';
import { SQL } from './mysql';

export class DataLoader
{
    static loadDatabase()
    {
        console.log("Importing data from database");

        loadCategories();
        loadComments();
        loadPosts();
        loadPostCats();
        loadUsers();
    
        console.log("Database loaded");
    }

    static checkDatabase()
    {
        const check = "SHOW DATABASES LIKE 'frameworks';"; 
        SQL.db.query(check, function (err: any, res: any)
        {
            if (err)
            {
                console.log(err);
            }
            else if (res.length < 1)
            {
                console.log("No table found. Building database");
                DataLoader.buildDatabase();
            }
            else
            {
                SQL.query("USE frameworks");
                DataLoader.loadDatabase();
            }
        });
    };

    static buildDatabase()
    {
        SQL.query("CREATE DATABASE frameworks;");
        SQL.query("USE frameworks;");

        const categories = 
            `DROP TABLE IF EXISTS categories;
             CREATE TABLE categories (
                categoryID smallint(3) unsigned NOT NULL,
                name tinytext,
                description tinytext,
                PRIMARY KEY (categoryID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        
        const comments = 
            `DROP TABLE IF EXISTS comments;
             CREATE TABLE comments (
                commentID smallint(3) unsigned NOT NULL,
                comment tinytext,
                userID tinytext NOT NULL,
                postID smallint(3) unsigned NOT NULL,
                commentDate bigint(10) NOT NULL,
                PRIMARY KEY (commentID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        
        const posts = 
            `DROP TABLE IF EXISTS posts;
             CREATE TABLE posts (
                postID smallint(3) unsigned NOT NULL,
                createdDate bigint(10) NOT NULL,
                title tinytext NOT NULL,
                content tinytext NOT NULL,
                userID tinytext NOT NULL,
                headerImage tinytext,
                lastUpdated bigint(10) NOT NULL,
                PRIMARY KEY (postID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        
        const postCategory = 
            `DROP TABLE IF EXISTS post_category;
             CREATE TABLE post_category (
                categoryID smallint(3) NOT NULL,
                postID smallint(3) NOT NULL,
                KEY (categoryID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        
        const users = 
            `DROP TABLE IF EXISTS users;
             CREATE TABLE users (
                userID varchar(20) NOT NULL,
                first tinytext NOT NULL,
                last tinytext NOT NULL,
                email tinytext NOT NULL,
                pass tinytext NOT NULL,
                PRIMARY KEY (userID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;

        SQL.query(categories);
        SQL.query(comments);
        SQL.query(posts);
        SQL.query(postCategory);
        SQL.query(users);
    }
}