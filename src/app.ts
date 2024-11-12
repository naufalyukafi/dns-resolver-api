import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';

import config from '@config/config';
import * as morgan from '@config/morgan';
import conditionalBodyParser from '@middlewares/conditionalBodyParser';
import authLimiter from '@middlewares/rateLimiter';
import { errorConverter, errorHandler } from '@middlewares/error';
import routes from '@routes/v1';
import ApiError from '@utils/ApiError';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

if (config.env !== 'development') {
  app.use(helmet());
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());

app.use(cors());
app.options('*', cors());

if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.use('/v1', conditionalBodyParser);
app.use('/v1', routes);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) return res.status(err.statusCode).send({ message: err.message });
  return res.status(httpStatus.NOT_FOUND).send({ message: 'Not found' });
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
