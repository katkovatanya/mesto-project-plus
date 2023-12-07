import { Request, Response } from 'express';

import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then(users => res.status(201).send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      return res.status(201).send({ data: user });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
};