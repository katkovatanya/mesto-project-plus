import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { UserRequest } from '../utils/types';
import {
  STATUS_CREATED,
  STATUS_SUCCESS,
  VALIDATION_ERROR_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
  CARD_DELITION_SUCCESS_MESSAGE,
  INVALID_DATA_MESSAGE,
  STATUS_FORBIDDEN_MESSAGE,
} from '../utils/constants';
import ValidationError from '../errors/validationError';
import NotFoundError from '../errors/notFoundError';
import ForbiddenError from '../errors/forbiddenError';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_SUCCESS).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const newCard = await Card.create({ name, link, owner });
    return res.status(STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(VALIDATION_ERROR_MESSAGE));
    }
    return next(error);
  }
};

export const deleteCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new ValidationError(INVALID_DATA_MESSAGE);
    }

    const card = await Card.findById(cardId);

    if (!card) {
      next(new NotFoundError(CARD_NOT_FOUND_MESSAGE));
    }
    const userId = req.user?._id;

    if (card?.owner.toString() !== userId) {
      next(new ForbiddenError(STATUS_FORBIDDEN_MESSAGE));
    }

    await Card.deleteOne({ _id: card?._id });

    return res
      .status(STATUS_SUCCESS)
      .send({ message: CARD_DELITION_SUCCESS_MESSAGE });
  } catch (error) {
    return next(error);
  }
};

export const likeCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      next(new ValidationError(INVALID_DATA_MESSAGE));
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    return res.status(STATUS_SUCCESS).send(updatedCard);
  } catch (error) {
    return next(error);
  }
};

export const dislikeCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      next(new ValidationError(INVALID_DATA_MESSAGE));
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    return res.status(STATUS_SUCCESS).send(updatedCard);
  } catch (error) {
    return next(error);
  }
};
