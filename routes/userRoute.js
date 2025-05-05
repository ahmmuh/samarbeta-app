import express from "express";
import {
  checkInKey,
  checkOutKeyAndAssignToUser,
  displayBorrowedByUser,
} from "../controllers/KeyController.js";
import { getAllUsers, getUserById } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:userId", getUserById);
userRouter.get("/users/keys/:keyId/:userId", displayBorrowedByUser);

userRouter.patch("/:userType/keys/:keyId/:userId/checkin", checkInKey);

userRouter.patch(
  "/:userType/keys/:keyId/:userId/checkout",
  checkOutKeyAndAssignToUser
);

export default userRouter;
