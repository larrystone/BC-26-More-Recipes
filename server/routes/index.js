import express from 'express';

import users from './users';
import recipes from './recipes';

const routes = express.Router();

// define router for '/users/*' routes
routes.use('/users', users);

// define router for '/recipes/*' routes
routes.use('/recipes', recipes);

export default routes;
