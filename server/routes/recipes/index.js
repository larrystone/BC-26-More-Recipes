import express from 'express';

import * as recipeController from '../../controllers/recipes';
import * as auth from '../../controllers/auth';

const user = express.Router();

user.use('*', auth.default);

user.post('/', recipeController.createRecipe);
user.get('/', recipeController.getAllRecipes);

user.put('/:recipeId', recipeController.modifyRecipe);
user.delete('/:recipeId', recipeController.deleteRecipe);

user.post('/:recipeId/reviews', recipeController.postReview);
user.get('/:recipeId/reviews', recipeController.getReviews);

export default user;
