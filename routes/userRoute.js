import express from "express";
import { displayBorrowedByUser } from "../controllers/KeyController.js";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  searchUser,
  updateUser,
} from "../controllers/UserController.js";
import { getToken } from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/authController.js";
import {
  saveExpoPushToken,
  sendPushNotis,
} from "../controllers/ExpoPushTokenController.js";

const userRouter = express.Router();

userRouter.get("/users/search", getToken, searchUser);
userRouter.get("/users", getToken, getAllUsers);
userRouter.delete("/users/:userId", getToken, deleteUser);

userRouter.get("/users/:userId", getToken, getUserById);
userRouter.put("/users/:userId", getToken, updateUser);

userRouter.get("/users/keys/:keyId/:userId", getToken, displayBorrowedByUser);

userRouter.patch("/users/save-token", getToken, saveExpoPushToken);
userRouter.post("/users/sendNotis", getToken, sendPushNotis);

export default userRouter;
