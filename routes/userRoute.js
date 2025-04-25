import express from "express";
import {
  checkInKey,
  checkOutKeyAndAssignToUser,
  displayBorrowedByUser,
} from "../controllers/KeyController.js";
import { getAllUsers } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/keys/:keyId/users/:userId", displayBorrowedByUser);

// keyRoute.patch("/keys/checkout", checkOutKey);
userRouter.patch("/:userType/:userId/keys/:keyId/checkin", checkInKey);

userRouter.patch(
  "/:userType/:userId/keys/:keyId/checkout",
  checkOutKeyAndAssignToUser
);

export default userRouter;
