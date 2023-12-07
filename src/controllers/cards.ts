import { Request, Response } from "express";
import Card from "../models/card";
import { UserRequest } from "types";

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const createCard = (req: UserRequest, res: Response) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }

      return res.status(201).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const likeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }

      return res.status(201).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const dislikeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }

      return res.status(201).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
