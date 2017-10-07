import express from 'express';
import * as validate from '../../middleware/validate';
import * as Recipe from '../../controllers/recipes';
import * as Review from '../../controllers/reviews';
import * as Vote from '../../controllers/votes';
import * as Auth from '../../middleware/auth';

const user = express.Router();
const newRecipe = new Recipe.default();
const newReview = new Review.default();
const newVote = new Vote.default();
const newAuth = new Auth.default();

user.use('*', newAuth.verify);

user.route('/')
  .post(newRecipe.createRecipe)
  .get(newRecipe.getAllRecipes);

user.route('/:recipeId')
  .all(validate.validateRecipeId)
  .get(newRecipe.getRecipe)
  .put(newRecipe.modifyRecipe)
  .delete(newRecipe.deleteRecipe);

user.route('/:recipeId/reviews')
  .post(newReview.postReview)
  .get(newReview.getReviews);

user.route('/:recipeId/upvotes')
  .post(newVote.upvoteRecipe)
  .get(newVote.getUserUpvotes);

user.route('/:recipeId/downvotes')
  .post(newVote.downvoteRecipe)
  .get(newVote.getUserDownvotes);

export default user;
