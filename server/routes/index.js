import express from 'express';

const routes = express.Router();

// Homepage route
routes.get('/', (req, res) => {
  res.status(201).json({ title: 'More-Recipes', message: 'Welcome Buddy...' });
});

// define catch all routes for http get requests
routes.get('*', (req, res) => {
  res.status(404).send('invalid link');
});

// define catch all routes for http post requests
routes.post('*', (req, res) => {
  res.status(404).send('invalid link');
});

/**
 * @exports routes
 * @return {obj} null
 */
export default routes;
