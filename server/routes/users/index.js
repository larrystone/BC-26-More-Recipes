import express from 'express';

import * as User from '../../controllers/users';
import * as Recipe from '../../controllers/recipes';
import * as Favorite from '../../controllers/favorites';

import * as Auth from '../../middleware/auth';

const user = express.Router();

const newUser = new User.default();
const newRecipe = new Recipe.default();
const newFavorite = new Favorite.default();
const newAuth = new Auth.default();


user.post('/signup', newUser.signUp);
user.post('/signin', newUser.signIn);

user.use('*', newAuth.verify);
user.get('/myRecipes', newRecipe.getUserRecipes);

user.route('/:userId/recipes/:recipeId')
  .post(newFavorite.addToFavorite)
  .delete(newFavorite.removeFromFavorites);

user.get('/:userId/recipes', newFavorite.getFavRecipes);

export default user;
