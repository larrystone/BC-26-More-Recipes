import express from 'express';

import users from './users';
import recipes from './recipes';

const routes = express.Router();

routes.use('/users', users);

routes.use('/recipes', recipes);

export default routes;
