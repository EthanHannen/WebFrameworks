/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/

import { Status, Message } from '../models/message';
import * as Cats from '../models/category';
import { JWTAuth } from '../utils/jwtauth';
import bodyParser from 'body-parser';
import express from 'express';
import { getPostsByCategory } from '../models/postcategory';

const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
const LETTERS_ONLY: RegExp = /^[A-Za-z]+$/;

// Returns all categories
router.get('/', (req,res,next)=>{
    res.status(Status.OK).send(Cats.getCategories());
});

// Creates a new category
router.post('/', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);

    if (user)
    {
        if (!req.body.categoryName || !req.body.categoryDescription)
            new Message(res, Status.NOT_ACCEPTABLE , "A category must contain a name and a description");
        else if (!LETTERS_ONLY.test(req.body.name))
            new Message(res, Status.NOT_ACCEPTABLE , "Category names may only contain letters");
        else if (Cats.getCategoryByName(req.body.categoryName) instanceof Cats.Category)
            new Message(res, Status.CONFLICT, "A category of that name already exists");
        else
        {
            let cat = new Cats.Category(
                Cats.Category.getID(),
                req.body.categoryName,
                req.body.categoryDescription
            );
            Cats.addCategory(cat);
            new Message(res, Status.CREATED, "Category created");
        }
    }
    else
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to add a category");
});

// Returns an existing category
router.get('/:categoryID', (req,res,next)=>{

    let category = Cats.getCategory(+req.params.categoryID);

    if (category instanceof Cats.Category)
        res.status(Status.OK).send(category);
    else
        new Message(res, Status.NOT_FOUND, "Category not found");
});

// Updates an existing category
router.patch('/:categoryID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let cat = undefined;

    if (user)
    {
        if (isNaN(+req.params.categoryID))
            res.status(Status.NOT_FOUND).redirect('/');
        else if(!(cat = Cats.getCategory(+req.params.categoryID)))
            new Message(res, Status.NOT_FOUND, "Category not found");
        else
        {
            if (req.body.categoryName)
                cat.categoryName = req.body.categoryName;
            if (req.body.categoryDescription)
                cat.categoryDescription = req.body.categoryDescription;
            Cats.updateCategory(cat);
            new Message(res, Status.OK, "Category updated");
        }            
    }
    else
        new Message(res, Status.UNAUTHORIZED,"You must be logged in to modify a category");
});

// Deletes an existing category
router.delete('/:categoryID', (req,res,next)=>{

    let user = JWTAuth.authenticateUser(res, req.headers);
    let cat = undefined;

    if (user)
    {
        if (isNaN(+req.params.categoryID))
            res.status(Status.NOT_FOUND).redirect('/');
        else if(!(cat = Cats.getCategory(+req.params.categoryID)))
            new Message(res, Status.NOT_FOUND, "Category not found");
        else
        {
            Cats.deleteCategory(cat);
            new Message(res, Status.OK, "Category deleted");
        }            
    }
    else
        new Message(res, Status.UNAUTHORIZED, "You must be logged in to delete a category");
});

export {router as categoryRouter};