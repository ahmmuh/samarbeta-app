import express from "express";
import {
  checkInKey,
  checkOutKeyAndAssignToUser,
  displayBorrowedByUser,
} from "../controllers/KeyController.js";
import { getAllUsers } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/keys/:keyId/users/:userId", displayBorrowedByUser);

userRouter.patch("/:userType/keys/:keyId/:userId/checkin", checkInKey);

userRouter.patch(
  "/:userType/keys/:keyId/:userId/checkout",
  checkOutKeyAndAssignToUser
);

export default userRouter;
