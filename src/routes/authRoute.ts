import { Router } from 'express';
import { createUser, login } from '../controllers/users';
import { signInValidator, signUpValidator } from '../utils/validators';

const authRouter = Router();

authRouter.post('/signin', signInValidator, login);
authRouter.post('/signup', signUpValidator, createUser);

export default authRouter;
