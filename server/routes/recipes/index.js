import express from 'express';

import * as userController from '../../controllers/recipes.js';

const user = express.Router();

// define route controllers for creating sign up, login and sign out
user.post('/', userController.addRecipe);


export default user;
