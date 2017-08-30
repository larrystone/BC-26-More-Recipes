import express from 'express';

import * as userController from '../../controllers/recipes';

const user = express.Router();

user.use('*', (req, res, next) => {
  // check for authentication here
  if (!req.session.user) {
    return res.status(401).send({
      error: 'You do not have the permission to perform this action!' });
  }

  next();
});

// define route controllers for adding recipe
user.post('/', userController.createRecgipe);
user.get('/', userController.getAllRecipes);


export default user;