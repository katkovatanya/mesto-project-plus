import { Request, Response } from 'express';
import logger from '../logger/logger';
import { SERVER_ERROR_MESSAGE, STATUS_SERVER_ERROR } from '../utils/constants';
import { ExtendedError } from '../utils/types';

const ErrorHub = (
  error: ExtendedError,
  req: Request,
  res: Response,
) => {
  logger.error(error.message, { stack: error.stack, ...req });
  res.status(error.statusCode || STATUS_SERVER_ERROR).json({
    status: 'error',
    message: error.message || SERVER_ERROR_MESSAGE,
  });
};

export default ErrorHub;
