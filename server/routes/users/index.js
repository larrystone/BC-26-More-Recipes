import express from 'express';

import * as userController from '../../controllers/users';
import * as recipeController from '../../controllers/recipes';
import * as favoriteController from '../../controllers/favorites';

import * as auth from '../../controllers/auth';

const user = express.Router();

user.post('/signup', userController.signUp);
user.post('/signin', userController.signIn);
user.post('/signout', userController.signOut);

user.get('/myRecipes', auth.default);
user.get('/myRecipes', recipeController.getUserRecipes);

user.post('/:userId/recipes/:recipeId', favoriteController.addToFavorite);
user.get('/:userId/recipes', favoriteController.getFavRecipes);

export default user;
