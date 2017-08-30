import express from 'express';

import users from './users';

const routes = express.Router();

// define router for users related routes
routes.use('/users', users);

export default routes;
