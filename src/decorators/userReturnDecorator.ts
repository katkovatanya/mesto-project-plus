import { NextFunction, Request, Response } from 'express';
import { UserReturnType } from "../utils/types";
import mongoose from 'mongoose';
import NotFoundError from '../errors/notFoundError';
import { USER_NOT_FOUND_MESSAGE, STATUS_SUCCESS, STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE } from '../utils/constants';


const UserReturnDecorator = (
  // eslint-disable-next-line no-unused-vars
  returnLogic: (req: Request) => Promise<UserReturnType>,
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await returnLogic(req);
    if (!user) throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    return res.status(STATUS_SUCCESS).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
    }
    return next(error);
  }
};

export default UserReturnDecorator;