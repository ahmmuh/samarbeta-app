import express from "express";
import {
  checkInKey,
  checkOutKeyAndAssignToUser,
  displayBorrowedByUser,
} from "../controllers/KeyController.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/UserController.js";
import { getToken } from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.get("/users", getToken, getAllUsers);
userRouter.get("/users/:userId", getToken, getUserById);
userRouter.put("/users/:userId", getToken, updateUser);

userRouter.get("/users/keys/:keyId/:userId", getToken, displayBorrowedByUser);

userRouter.patch(
  "/:userType/keys/:keyId/:userId/checkin",
  getToken,
  checkInKey
);

userRouter.patch(
  "/:userType/keys/:keyId/:userId/checkout",
  getToken,
  checkOutKeyAndAssignToUser
);

export default userRouter;
