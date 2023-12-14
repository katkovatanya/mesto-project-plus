import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import {
  STATUS_CREATED,
  STATUS_SUCCESS,
  USER_NOT_FOUND_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  INVALID_DATA_MESSAGE,
  WRONG_EMAIL_PASSWORD_MESSAGE,
  USER_EXISTS_MESSAGE,
} from '../utils/constants';
import { UserRequest } from '../utils/types';
import UnauthorizedError from '../errors/unauthorizedError';
import UserExistsError from '../errors/userExists';
import ValidationError from '../errors/validationError';
import NotFoundError from '../errors/notFoundError';

export const jwtSecret = 'some-secret-key';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ValidationError(INVALID_DATA_MESSAGE);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    return res.status(STATUS_SUCCESS).send(user);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((newUser) => res.status(STATUS_CREATED).send({ id: newUser._id }))
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return next(new ValidationError(VALIDATION_ERROR_MESSAGE));
          }
          if (error.code === 11000) {
            return next(new UserExistsError(USER_EXISTS_MESSAGE));
          }
          return next(error);
        });
    })
    .catch(next);
};

export const updateUserProfile = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((data) => res.send(data))
    .catch((err) => {
      next(err);
    });
};

export const updateUserAvatar = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((data) => res.send(data))
    .catch((err) => {
      next(err);
    });
};

export const getAuthUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?._id;

    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }
    return res.status(STATUS_SUCCESS).send(user);
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new UnauthorizedError(WRONG_EMAIL_PASSWORD_MESSAGE);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedError(WRONG_EMAIL_PASSWORD_MESSAGE);
    }
    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'strict',
    });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};
