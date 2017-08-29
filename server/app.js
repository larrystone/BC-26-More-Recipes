import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// The app's legitimate route prefix
app.use('/api/v1', routes);

// Homepage route
app.get('/', (req, res) => {
  res.status(201).json({ title: 'More-Recipes',
    message: 'Welcome... Please navigate the API via /api/v1/ url prefix' });
});

// Define catch all routes for http get requests
app.get('*', (req, res) => {
  res.status(404).send('invalid link');
});

// Define catch all routes for http post requests
app.post('*', (req, res) => {
  res.status(404).send('invalid link');
});

app.listen(port, () => {
  // TODO remove in production environment
  console.log(`App listening on port ${port}`);
});

export default app;
