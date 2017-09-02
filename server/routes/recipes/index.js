import express from 'express';

import * as recipeController from '../../controllers/recipes';
import * as reviewController from '../../controllers/reviews';
import * as auth from '../../middleware/auth';

const user = express.Router();

user.use('*', auth.default);

user.post('/', recipeController.createRecipe);
user.get('/', recipeController.getAllRecipes);

user.put('/:recipeId', recipeController.modifyRecipe);
user.delete('/:recipeId', recipeController.deleteRecipe);

user.post('/:recipeId/reviews', reviewController.postReview);
user.get('/:recipeId/reviews', reviewController.getReviews);

export default user;
