import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { UserRequest } from "types";
import { STATUS_CREATED, STATUS_NOT_FOUND, STATUS_SUCCESS } from "../constants";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  try {
    return Card.find({}).then((cards) =>
      res.status(STATUS_SUCCESS).send({ data: cards })
    );
  } catch (error) {
    return next(error);
  }
};

export const createCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    return Card.create({ name, link, owner: req.user?._id }).then((card) =>
      res.status(STATUS_CREATED).send({ data: card })
    );
  } catch (error) {
    return next(error);
  }
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    return Card.findByIdAndRemove(cardId).then((card) => {
      if (!card) {
        return res.status(STATUS_NOT_FOUND).send({ message: "Card not found" });
      }

      return res.status(STATUS_SUCCESS).send({ data: card });
    });
  } catch (error) {
    return next(error);
  }
};

export const likeCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    return Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
      { new: true }
    ).then((card) => {
      if (!card) {
        return res.status(STATUS_NOT_FOUND).send({ message: "Card not found" });
      }

      return res.status(STATUS_SUCCESS).send({ data: card });
    });
  } catch (error) {
    return next(error);
  }
};

export const dislikeCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    return Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    ).then((card) => {
      if (!card) {
        return res.status(STATUS_NOT_FOUND).send({ message: "Card not found" });
      }
      return res.status(STATUS_SUCCESS).send({ data: card });
    });
  } catch (error) {
    return next(error);
  }
};
