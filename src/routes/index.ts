import { Request, Response, Router } from 'express';
import { STATUS_NOT_FOUND, INVALID_DATA_MESSAGE } from '../constants';
import cardsRouter from './cards';
import userRouter from './users';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardsRouter);

router.use((_req: Request, res: Response) => {
  res.status(STATUS_NOT_FOUND).send(INVALID_DATA_MESSAGE);
});

export default router;