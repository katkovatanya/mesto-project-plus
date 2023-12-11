import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { UserRequest } from "types";
import {
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_SUCCESS,
  STATUS_BAD_REQUEST,
  VALIDATION_ERROR_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
  CARD_DELITION_SUCCESS_MESSAGE,
  INVALID_DATA_MESSAGE
} from "../constants";
import mongoose, { ObjectId } from "mongoose";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate(["owner", "likes"]);
    return res.status(STATUS_SUCCESS).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const owner = (req.user as { _id: string | ObjectId })._id;
    const newCard = await Card.create({ name, link, owner });
    return res.status(STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ ...error, message: VALIDATION_ERROR_MESSAGE });
    }
    return next(error);
  }
};

export const deleteCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE});
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res
        .status(STATUS_NOT_FOUND)
        .send({ message: CARD_NOT_FOUND_MESSAGE });
    } else {
      await Card.deleteOne({ _id: card._id });
      return res
        .status(STATUS_SUCCESS)
        .send({ message: CARD_DELITION_SUCCESS_MESSAGE });
    }
  } catch (error) {
    return next(error);
  }
};

export const likeCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE});
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedCard) {
      return res
        .status(STATUS_NOT_FOUND)
        .send({ message: CARD_NOT_FOUND_MESSAGE });
    }

    return res.status(STATUS_SUCCESS).send(updatedCard);
  } catch (error) {
    return next(error);
  }
};

export const dislikeCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE});
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedCard) {
      return res
        .status(STATUS_NOT_FOUND)
        .send({ message: CARD_NOT_FOUND_MESSAGE });
    }

    return res.status(STATUS_SUCCESS).send(updatedCard);
  } catch (error) {
    return next(error);
  }
};
