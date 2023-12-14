import { Router } from "express";
import {
  getUsers,
  getUserById,
  getAuthUser,
  updateUserProfile,
  updateUserAvatar,
} from "../controllers/users";
import {
  profileValidator,
  avatarValidator,
  userIdValidator,
} from "../utils/validators";

const router = Router();

router.get("/", getUsers);

router.get("/:userId", userIdValidator, getUserById);
router.get("/me", getAuthUser);

router.patch("/me", profileValidator, updateUserProfile);
router.patch("/me/avatar", avatarValidator, updateUserAvatar);

export default router;
