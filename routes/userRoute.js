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
userRouter.patch("/checkin/keys/:keyId/:userId", checkInKey);

userRouter.patch("/checkout/keys/:keyId/:userId", checkOutKeyAndAssignToUser);

export default userRouter;
