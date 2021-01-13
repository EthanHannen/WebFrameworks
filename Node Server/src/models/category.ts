/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { deleteByCategory } from "./postcategory";
import { SQL } from "../utils/mysql";

var CATEGORIES: Category[] = [];

// Category object
export class Category {

    categoryId:          number;
    categoryName:        string;
    categoryDescription: string;

    private static autoID: number = 0;

    constructor(
        id:          number,
        name:        string,
        description: string, 
    )
    {
        this.categoryId          = id;
        this.categoryName        = name;
        this.categoryDescription = description;
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

export function loadCategories()
{
    const id = "SELECT MAX(categoryID) AS ID from categories";
    const query = "SELECT * FROM categories";

    SQL.db.query(id, function (err: any, res: any) {
        if (err)
            console.log(err);
        else
            Category.setID(res[0].ID);
    });
    SQL.db.query(query, function (err: any, res: any[]) {
        if (err)
            console.log(err);
        else
        {
            res.forEach((u) => {
                let cat = new Category(
                    u.categoryID,
                    u.name,
                    u.description
                )
                CATEGORIES.push(cat);
            });
        }
    });
}

export function addCategory(cat: Category)
{
    SQL.query(
        `INSERT INTO categories 
        (categoryID, name, description) 
        VALUES(
            '${cat.categoryId}',
            '${cat.categoryName}',
            '${cat.categoryDescription}'
        )`
    );
    CATEGORIES.push(cat);
}

export function getCategories()
{
    return CATEGORIES;
}

export function getCategory(id: number)
{
    return CATEGORIES.find(c => c.categoryId === id);
}

export function getCategoryByName(name: string)
{
    return CATEGORIES.find(c => c.categoryName === name);
}

export function updateCategory(cat: Category)
{
    SQL.query(
        `UPDATE categories
            SET 
            name = '${cat.categoryName}',
            description = '${cat.categoryDescription}' 
            WHERE categoryID = '${cat.categoryId}'`
    );
}

export function deleteCategory(cat: Category)
{
    let index:number = CATEGORIES.findIndex(c => c.categoryId === cat.categoryId)

    if (index >= 0)
    {
        SQL.query(
            `DELETE FROM categories
             WHERE categoryID = '${cat.categoryId}'`
        );

        deleteByCategory(cat.categoryId); // Delete all Post Categories
        CATEGORIES.splice(index);
    }
}