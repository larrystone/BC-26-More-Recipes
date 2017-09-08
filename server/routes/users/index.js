import express from 'express';

import * as userController from '../../controllers/users';
import * as recipeController from '../../controllers/recipes';
import * as favoriteController from '../../controllers/favorites';
import * as validate from '../../middleware/validate';

import * as auth from '../../middleware/auth';

const user = express.Router();

user.post('/signup', userController.signUp);
user.post('/signin', userController.signIn);

user.use('*', auth.verify);
user.get('/myRecipes', recipeController.getUserRecipes);

user.use(':userId/recipes', validate.validateUserId);
user.post('/:userId/recipes/:recipeId', favoriteController.addToFavorite);
user.delete('/:userId/recipes/:recipeId',
  favoriteController.removeFromFavorites);
user.get('/:userId/recipes', favoriteController.getFavRecipes);

export default user;
