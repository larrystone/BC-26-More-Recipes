import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api-docs', express.static('server/docs'));

app.use('/api/v1/', routes);

app.use('/', express.static('build'));
app.use('*', express.static('build'));

app.listen(port, () => {
});

export default app;
