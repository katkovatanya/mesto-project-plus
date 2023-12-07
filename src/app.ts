import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { UserRequest } from './types';

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

// подключаем мидлвары, роуты и всё остальное...
app.use((req: UserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65708c73979fe70c8171aa5a'
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});