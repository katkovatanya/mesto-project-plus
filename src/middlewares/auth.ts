import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {
  AUTHORIZATION_NEEDED_MESSAGE,
} from '../utils/constants';
import { jwtSecret } from '../controllers/users';
import UnauthorizedError from '../errors/unauthorizedError';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const AuthorizedUser = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(AUTHORIZATION_NEEDED_MESSAGE));
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError(AUTHORIZATION_NEEDED_MESSAGE));
  }
};

export default AuthorizedUser;
