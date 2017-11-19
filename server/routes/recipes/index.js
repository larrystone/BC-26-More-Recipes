import express from 'express';
import { validateRecipeId } from '../../middleware/validate';
import validateRecipeExist from '../../middleware/validateRecipeExist';
import Recipe from '../../controllers/recipes';
import Review from '../../controllers/reviews';
import Vote from '../../controllers/votes';
import Auth from '../../middleware/auth';

const user = express.Router();
const newRecipe = new Recipe();
const newReview = new Review();
const newVote = new Vote();
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
  .get(newVote.getUserUpvotes);

user.route('/:recipeId/downvotes')
  .all(validateRecipeId, validateRecipeExist)
  .post(newVote.downvoteRecipe)
  .get(newVote.getUserDownvotes);

export default user;
