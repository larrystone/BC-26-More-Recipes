import express from 'express';
import {
  validateRecipeId, validateRecipeExist
} from '../../middleware/validate';
import Recipes from '../../controllers/recipes';
import Reviews from '../../controllers/reviews';
import Votes from '../../controllers/votes';
import Auth from '../../middleware/auth';

const user = express.Router();
const newRecipe = new Recipes();
const newReview = new Reviews();
const newVote = new Votes();
const newAuth = new Auth();

user.use('*', newAuth.verify);

user.route('/')
  .post(newRecipe.createRecipe)
  .get(newRecipe.getAllRecipes);

user.route('/:recipeId')
  .all(validateRecipeId, validateRecipeExist)
  .get(newRecipe.getRecipe)
  .put(newRecipe.modifyRecipe)
  .delete(newRecipe.deleteRecipe);

user.route('/:recipeId/reviews')
  .all(validateRecipeId, validateRecipeExist)
  .post(newReview.postReview)
  .get(newReview.getRecipeReviews);

user.route('/:recipeId/upvotes')
  .all(validateRecipeId, validateRecipeExist)
  .post(newVote.upvoteRecipe)
  .get(newVote.getRecipeUpvotes);

user.route('/:recipeId/downvotes')
  .all(validateRecipeId, validateRecipeExist)
  .post(newVote.downvoteRecipe)
  .get(newVote.getRecipeDownvotes);

export default user;
