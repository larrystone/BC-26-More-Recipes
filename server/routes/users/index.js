import express from 'express';

import * as userController from '../../controllers/users';

const user = express.Router();

// define route controllers for creating sign up, login and sign out
user.post('/signup', userController.signUp);
user.post('/signin', userController.signIn);

user.post('/signout', userController.signOut);

export default user;
