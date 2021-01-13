"use strict";
/*******************************************
 * @title   Assignment 3 - Back End
 * @author  Ethan Hannen
 * @created December 1, 2020
 *******************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const message_1 = require("../models/message");
const Cats = __importStar(require("../models/category"));
const jwtauth_1 = require("../utils/jwtauth");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.categoryRouter = router;
router.use(body_parser_1.default.urlencoded({ extended: false }));
const LETTERS_ONLY = /^[A-Za-z]+$/;
// Returns all categories
router.get('/', (req, res, next) => {
    res.status(message_1.Status.OK).send(Cats.getCategories());
});
// Creates a new category
router.post('/', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    if (user) {
        if (!req.body.categoryName || !req.body.categoryDescription)
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "A category must contain a name and a description");
        else if (!LETTERS_ONLY.test(req.body.name))
            new message_1.Message(res, message_1.Status.NOT_ACCEPTABLE, "Category names may only contain letters");
        else if (Cats.getCategoryByName(req.body.categoryName) instanceof Cats.Category)
            new message_1.Message(res, message_1.Status.CONFLICT, "A category of that name already exists");
        else {
            let cat = new Cats.Category(Cats.Category.getID(), req.body.categoryName, req.body.categoryDescription);
            Cats.addCategory(cat);
            new message_1.Message(res, message_1.Status.CREATED, "Category created");
        }
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to add a category");
});
// Returns an existing category
router.get('/:categoryID', (req, res, next) => {
    let category = Cats.getCategory(+req.params.categoryID);
    if (category instanceof Cats.Category)
        res.status(message_1.Status.OK).send(category);
    else
        new message_1.Message(res, message_1.Status.NOT_FOUND, "Category not found");
});
// Updates an existing category
router.patch('/:categoryID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let cat = undefined;
    if (user) {
        if (isNaN(+req.params.categoryID))
            res.status(message_1.Status.NOT_FOUND).redirect('/');
        else if (!(cat = Cats.getCategory(+req.params.categoryID)))
            new message_1.Message(res, message_1.Status.NOT_FOUND, "Category not found");
        else {
            if (req.body.categoryName)
                cat.categoryName = req.body.categoryName;
            if (req.body.categoryDescription)
                cat.categoryDescription = req.body.categoryDescription;
            Cats.updateCategory(cat);
            new message_1.Message(res, message_1.Status.OK, "Category updated");
        }
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to modify a category");
});
// Deletes an existing category
router.delete('/:categoryID', (req, res, next) => {
    let user = jwtauth_1.JWTAuth.authenticateUser(res, req.headers);
    let cat = undefined;
    if (user) {
        if (isNaN(+req.params.categoryID))
            res.status(message_1.Status.NOT_FOUND).redirect('/');
        else if (!(cat = Cats.getCategory(+req.params.categoryID)))
            new message_1.Message(res, message_1.Status.NOT_FOUND, "Category not found");
        else {
            Cats.deleteCategory(cat);
            new message_1.Message(res, message_1.Status.OK, "Category deleted");
        }
    }
    else
        new message_1.Message(res, message_1.Status.UNAUTHORIZED, "You must be logged in to delete a category");
});
//# sourceMappingURL=category.js.map