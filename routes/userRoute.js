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

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:userId", getUserById);
userRouter.put("/users/:userId", updateUser);

userRouter.get("/users/keys/:keyId/:userId", displayBorrowedByUser);

userRouter.patch("/:userType/keys/:keyId/:userId/checkin", checkInKey);

userRouter.patch(
  "/:userType/keys/:keyId/:userId/checkout",
  checkOutKeyAndAssignToUser
);

export default userRouter;
