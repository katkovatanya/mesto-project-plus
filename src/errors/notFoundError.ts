import { STATUS_NOT_FOUND } from '../utils/constants';

class NotFoundError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = STATUS_NOT_FOUND;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;