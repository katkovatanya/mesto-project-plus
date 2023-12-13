import mongoose, { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { UserData, UpdateUserData, UserRequest } from "../utils/types";
import User from "../models/user";
import {
  STATUS_SUCCESS,
  STATUS_BAD_REQUEST,
  VALIDATION_ERROR_MESSAGE,
} from "../utils/constants";
import ValidationError from "../errors/validationError";

const updateUser = async (
  id: string | ObjectId,
  data: UpdateUserData,
) => User.findByIdAndUpdate(id, data, {
  new: true,
  runValidators: true,
});

const userUpdateDecorator = (dataExtractor: (req: UserRequest) => UserData) => async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = dataExtractor(req);
    const userId = await (req.user as { _id: string | ObjectId })._id;
    const updatedUser = await updateUser(userId, data);
    return res.status(STATUS_SUCCESS).send(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = new ValidationError(VALIDATION_ERROR_MESSAGE, error);
      return next(validationError);
    }
    return next(error);
  }
};
export default userUpdateDecorator;
