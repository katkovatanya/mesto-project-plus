import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import UserReturnDecorator from "../decorators/userReturnDecorator";
import {
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_SUCCESS,
  USER_NOT_FOUND_MESSAGE,
  STATUS_BAD_REQUEST,
  VALIDATION_ERROR_MESSAGE,
  INVALID_DATA_MESSAGE,
  WRONG_EMAIL_PASSWORD_MESSAGE,
  USER_EXISTS_MESSAGE,
} from "../utils/constants";
import mongoose, { ObjectId } from "mongoose";
import userUpdateDecorator from "../decorators/userUpdateDecorator";
import { UserRequest } from "../utils/types";
import UnauthorizedError from "../errors/unauthorizedError";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserExistsError from "../errors/userExists";
import ValidationError from "../errors/validationError";
import NotFoundError from "../errors/notFoundError";
import { error } from "console";

export const jwtSecret = "some-secret-key";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_SUCCESS).send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ValidationError(INVALID_DATA_MESSAGE, error);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    return res.status(STATUS_SUCCESS).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      return res
        .status(STATUS_NOT_FOUND)
        .send({ message: USER_NOT_FOUND_MESSAGE });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: INVALID_DATA_MESSAGE });
    }
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new UserExistsError(USER_EXISTS_MESSAGE);
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    return res.status(STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = new ValidationError(
        VALIDATION_ERROR_MESSAGE,
        error
      );
      return next(validationError);
    }
    return next(error);
  }
};

export const updateUserProfile = userUpdateDecorator((req: Request) => {
  const { name, about } = req.body;
  return { name, about };
});

export const updateUserAvatar = userUpdateDecorator((req: Request) => {
  const { avatar } = req.body;
  return { avatar };
});

export const getAuthUser = UserReturnDecorator(async (req: UserRequest) => {
  const userId = (req.user as { _id: string | ObjectId })._id;
  return User.findById(userId);
});

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      throw new UnauthorizedError(WRONG_EMAIL_PASSWORD_MESSAGE);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedError(WRONG_EMAIL_PASSWORD_MESSAGE);
    }
    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "7d" });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};
