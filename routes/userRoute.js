import express from "express";
import {
  checkInKey,
  checkOutKeyAndAssignToUser,
  displayBorrowedByUser,
} from "../controllers/KeyController.js";

const userRouter = express.Router();

userRouter.get("/keys/:keyId/users/:userId", displayBorrowedByUser);

// keyRoute.patch("/keys/checkout", checkOutKey);
userRouter.patch(
  "/units/:unitId/:userType/:userId/keys/:keyId/checkin",
  checkInKey
);

userRouter.patch(
  "/units/:unitId/:userType/:userId/keys/:keyId/checkout",
  checkOutKeyAndAssignToUser
);

export default userRouter;
