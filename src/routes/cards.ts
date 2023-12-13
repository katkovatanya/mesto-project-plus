import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/cards';
import AuthorizedUser from '../middlewares/auth';
import { cardIdValidator, createCardValidator } from '../utils/validators';

const router = Router();

router.get('/', AuthorizedUser, getCards);
router.post('/', AuthorizedUser, createCardValidator, createCard);
router.delete('/:cardId', AuthorizedUser, cardIdValidator, deleteCard);
router.put('/:cardId/likes', AuthorizedUser, cardIdValidator, likeCard);
router.delete('/:cardId/likes', AuthorizedUser, cardIdValidator, dislikeCard);

export default router;