import expressWinston from 'express-winston';
import winstonLogger from './logger';

export const requestLogger = expressWinston.logger({
  winstonInstance: winstonLogger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
});

export const errorLogger = expressWinston.errorLogger({
  winstonInstance: winstonLogger,
});
