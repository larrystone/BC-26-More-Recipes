import express from 'express';

import * as userController from '../../controllers/users';
import * as recipeController from '../../controllers/recipes';

const user = express.Router();

// define route controllers for creating sign up, login and sign out
user.post('/signup', userController.signUp);
user.post('/signin', userController.signIn);
user.post('/signout', userController.signOut);

// define route for fetching User stored recipes
user.get('/myRecipes', recipeController.getUserRecipes);

export default user;
