import express from 'express';

import * as userController from '../../controllers/recipes';
import * as auth from '../../controllers/auth';

const user = express.Router();

user.use('*', auth.default);

// define route controllers for adding recipe
user.post('/', userController.createRecipe);
user.get('/', userController.getAllRecipes);


export default user;
