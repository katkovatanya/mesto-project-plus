import { Router } from "express";
import {
  getUsers,
  getUserById,
  getAuthUser,
  updateUserProfile,
  updateUserAvatar,
} from "../controllers/users";
import AuthorizedUser from "../middlewares/auth";
import { profileValidator, avatarValidator, userIdValidator } from "../utils/validators";

const router = Router();

router.get("/", AuthorizedUser, getUsers);

router.get("/:userId", userIdValidator, getUserById);
router.get("/me", getAuthUser);

router.patch("/me", profileValidator, AuthorizedUser, updateUserProfile);
router.patch("/me/avatar", avatarValidator, AuthorizedUser, updateUserAvatar);

export default router;