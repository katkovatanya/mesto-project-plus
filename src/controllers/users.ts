import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { UserRequest } from "types";
import { STATUS_CREATED, STATUS_NOT_FOUND, STATUS_SUCCESS } from "../constants";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    return User.find({}).then((users) =>
      res.status(STATUS_SUCCESS).send({ data: users })
    );
  } catch (error) {
    return next(error);
  }
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    return User.findById(userId).then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }

      return res.status(STATUS_SUCCESS).send({ data: user });
    });
  } catch (error) {
    return next(error);
  }
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch((err) =>
      res.status(STATUS_NOT_FOUND).send({ message: err.message })
    );
};

export const updateUserProfile = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;

    return User.findByIdAndUpdate(req.user?._id, { name, about }).then(
      (user) => {
        if (!user) {
          return res
            .status(STATUS_NOT_FOUND)
            .send({ message: "User not found" });
        }

        return res.status(STATUS_SUCCESS).send({ data: user });
      }
    );
  } catch (error) {
    return next(error);
  }
};

export const updateUserAvatar = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;

    return User.findByIdAndUpdate(req.user?._id, { avatar }).then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }

      return res.status(STATUS_SUCCESS).send({ data: user });
    });
  } catch (error) {
    return next(error);
  }
};
