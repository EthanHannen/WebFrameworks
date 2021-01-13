"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLoader = void 0;
const category_1 = require("../models/category");
const comment_1 = require("../models/comment");
const post_1 = require("../models/post");
const postcategory_1 = require("../models/postcategory");
const user_1 = require("../models/user");
const mysql_1 = require("./mysql");
class DataLoader {
    static loadDatabase() {
        console.log("Importing data from database");
        category_1.loadCategories();
        comment_1.loadComments();
        post_1.loadPosts();
        postcategory_1.loadPostCats();
        user_1.loadUsers();
        console.log("Database loaded");
    }
    static checkDatabase() {
        const check = "SHOW DATABASES LIKE 'frameworks';";
        mysql_1.SQL.db.query(check, function (err, res) {
            if (err) {
                console.log(err);
            }
            else if (res.length < 1) {
                console.log("No table found. Building database");
                DataLoader.buildDatabase();
            }
            else {
                mysql_1.SQL.query("USE frameworks");
                DataLoader.loadDatabase();
            }
        });
    }
    ;
    static buildDatabase() {
        mysql_1.SQL.query("CREATE DATABASE frameworks;");
        mysql_1.SQL.query("USE frameworks;");
        const categories = `DROP TABLE IF EXISTS categories;
             CREATE TABLE categories (
                categoryID smallint(3) unsigned NOT NULL,
                name tinytext,
                description tinytext,
                PRIMARY KEY (categoryID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        const comments = `DROP TABLE IF EXISTS comments;
             CREATE TABLE comments (
                commentID smallint(3) unsigned NOT NULL,
                comment tinytext,
                userID tinytext NOT NULL,
                postID smallint(3) unsigned NOT NULL,
                commentDate bigint(10) NOT NULL,
                PRIMARY KEY (commentID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        const posts = `DROP TABLE IF EXISTS posts;
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
        const postCategory = `DROP TABLE IF EXISTS post_category;
             CREATE TABLE post_category (
                categoryID smallint(3) NOT NULL,
                postID smallint(3) NOT NULL,
                KEY (categoryID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        const users = `DROP TABLE IF EXISTS users;
             CREATE TABLE users (
                userID varchar(20) NOT NULL,
                first tinytext NOT NULL,
                last tinytext NOT NULL,
                email tinytext NOT NULL,
                pass tinytext NOT NULL,
                PRIMARY KEY (userID)
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`;
        mysql_1.SQL.query(categories);
        mysql_1.SQL.query(comments);
        mysql_1.SQL.query(posts);
        mysql_1.SQL.query(postCategory);
        mysql_1.SQL.query(users);
    }
}
exports.DataLoader = DataLoader;
//# sourceMappingURL=dataloader.js.map