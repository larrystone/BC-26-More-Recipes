import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.status(201).json({ title: 'More-Recipes',
    message: 'Please navigate this API via \'/api/v1/\' url prefix' });
});

app.get('*', (req, res) => {
  res.status(404).send('invalid link');
});

app.post('*', (req, res) => {
  res.status(404).send('invalid link');
});

app.listen(port, () => {
});

export default app;
