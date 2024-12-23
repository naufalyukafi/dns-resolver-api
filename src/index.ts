import mongoose, { ConnectOptions } from 'mongoose';

import app from '@app/app';
import config from '@config/config';
import logger from '@config/logger';
import startCheckAndUpdateCronJob from './cronJobs/cronjob';

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options as ConnectOptions).then(() => {
  logger.info(`Connected to MongoDB : ${config.mongoose.url}`);
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
    startCheckAndUpdateCronJob()
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
