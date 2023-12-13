import { STATUS_BAD_REQUEST } from '../utils/constants';

class ValidationError extends Error {
  statusCode: number;
  constructor(message: string, public details: any) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

export default ValidationError;