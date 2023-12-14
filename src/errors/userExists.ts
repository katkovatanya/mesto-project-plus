import { STATUS_USER_EXISTS } from '../utils/constants';

class UserExistsError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_USER_EXISTS;
    Object.setPrototypeOf(this, UserExistsError.prototype);
  }
}

export default UserExistsError;
