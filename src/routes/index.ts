import {
  Request, Response, Router, NextFunction,
} from 'express';
import { INVALID_DATA_MESSAGE } from '../utils/constants';
import cardsRouter from './cards';
import userRouter from './users';
import authRouter from './authRoute';
import NotFoundError from '../errors/notFoundError';
import AuthorizedUser from '../middlewares/auth';

const drop404 = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(INVALID_DATA_MESSAGE));
};

const router = Router();
router.use(authRouter);
router.use('/users', AuthorizedUser, userRouter);
router.use('/cards', AuthorizedUser, cardsRouter);
router.use('/*', AuthorizedUser, drop404);

export default router;
