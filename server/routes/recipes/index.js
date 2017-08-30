import express from 'express';

import * as userController from '../../controllers/recipes';
import * as auth from '../../controllers/auth';

const user = express.Router();

user.use('*', auth.default);

// define route controllers
user.post('/', userController.createRecipe);
user.get('/', userController.getAllRecipes);

user.put('/:recipeId', userController.modifyRecipe);
user.delete('/:recipeId', userController.deleteRecipe);

export default user;
