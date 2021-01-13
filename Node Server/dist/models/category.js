"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryByName = exports.getCategory = exports.getCategories = exports.addCategory = exports.loadCategories = exports.Category = void 0;
const postcategory_1 = require("./postcategory");
const mysql_1 = require("../utils/mysql");
var CATEGORIES = [];
// Category object
class Category {
    constructor(id, name, description) {
        this.categoryId = id;
        this.categoryName = name;
        this.categoryDescription = description;
    }
    static getID() {
        return ++this.autoID;
    }
    static setID(id) {
        this.autoID = id;
    }
}
exports.Category = Category;
Category.autoID = 0;
function loadCategories() {
    const id = "SELECT MAX(categoryID) AS ID from categories";
    const query = "SELECT * FROM categories";
    mysql_1.SQL.db.query(id, function (err, res) {
        if (err)
            console.log(err);
        else
            Category.setID(res[0].ID);
    });
    mysql_1.SQL.db.query(query, function (err, res) {
        if (err)
            console.log(err);
        else {
            res.forEach((u) => {
                let cat = new Category(u.categoryID, u.name, u.description);
                CATEGORIES.push(cat);
            });
        }
    });
}
exports.loadCategories = loadCategories;
function addCategory(cat) {
    mysql_1.SQL.query(`INSERT INTO categories 
        (categoryID, name, description) 
        VALUES(
            '${cat.categoryId}',
            '${cat.categoryName}',
            '${cat.categoryDescription}'
        )`);
    CATEGORIES.push(cat);
}
exports.addCategory = addCategory;
function getCategories() {
    return CATEGORIES;
}
exports.getCategories = getCategories;
function getCategory(id) {
    return CATEGORIES.find(c => c.categoryId === id);
}
exports.getCategory = getCategory;
function getCategoryByName(name) {
    return CATEGORIES.find(c => c.categoryName === name);
}
exports.getCategoryByName = getCategoryByName;
function updateCategory(cat) {
    mysql_1.SQL.query(`UPDATE categories
            SET 
            name = '${cat.categoryName}',
            description = '${cat.categoryDescription}' 
            WHERE categoryID = '${cat.categoryId}'`);
}
exports.updateCategory = updateCategory;
function deleteCategory(cat) {
    let index = CATEGORIES.findIndex(c => c.categoryId === cat.categoryId);
    if (index >= 0) {
        mysql_1.SQL.query(`DELETE FROM categories
             WHERE categoryID = '${cat.categoryId}'`);
        postcategory_1.deleteByCategory(cat.categoryId); // Delete all Post Categories
        CATEGORIES.splice(index);
    }
}
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.js.map