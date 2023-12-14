import { Router } from 'express';
import { createUser, login } from '../controllers/users';

const authRouter = Router();

authRouter.post('/signin', login);
authRouter.post('/signup', createUser);

export default authRouter;
