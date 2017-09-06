import express from 'express';

import * as recipeController from '../../controllers/recipes';
import * as reviewController from '../../controllers/reviews';
import * as voteController from '../../controllers/votes';
import * as auth from '../../middleware/auth';

const user = express.Router();

user.use('*', auth.verify);

user.post('/', recipeController.createRecipe);
user.get('/', recipeController.getAllRecipes);

user.get('/:recipeId', recipeController.getRecipe);
user.put('/:recipeId', recipeController.modifyRecipe);
user.delete('/:recipeId', recipeController.deleteRecipe);

user.post('/:recipeId/reviews', reviewController.postReview);
user.get('/:recipeId/reviews', reviewController.getReviews);

user.post('/:recipeId/upvotes', voteController.upvoteRecipe);
user.post('/:recipeId/downvotes', voteController.downvoteRecipe);
user.get('/:recipeId/upvotes', voteController.getUserUpvotes);
user.get('/:recipeId/downvotes', voteController.getUserDownvotes);

export default user;
