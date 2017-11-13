import express from 'express';

import User from '../../controllers/users';
import Recipe from '../../controllers/recipes';
import Favorite from '../../controllers/favorites';
import Review from '../../controllers/reviews';
import { validateRecipeId, validateUserId } from '../../middleware/validate';
import validateRecipeExist from '../../middleware/validateRecipeExist';
import Auth from '../../middleware/auth';

const user = express.Router();

const newUser = new User();
const newRecipe = new Recipe();
const newFavorite = new Favorite();
const newAuth = new Auth();
const newReview = new Review();

user.post('/signup', newUser.signUp);
user.post('/signin', newUser.signIn);

user.use('*', newAuth.verify);
user.get('/myRecipes', newRecipe.getUserRecipes);

user.route('/:userId/profile')
  .get(validateUserId, newUser.getUser);

user.put('/changePassword', newUser.changePassword);

user.route('/:userId/recipes/:recipeId')
  .all(validateRecipeId, validateUserId, validateRecipeExist)
  .post(newFavorite.addToFavorite)
  .delete(newFavorite.removeFromFavorites);

user.get('/:userId/recipes', validateUserId, newFavorite.getFavRecipes);
user.get('/:userId/reviews', validateUserId, newReview.getUserReviews);

export default user;
