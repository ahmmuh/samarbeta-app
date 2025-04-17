import express from "express";
import { displayBorrowedByUser } from "../controllers/KeyController.js";

const userRouter = express.Router();

userRouter.get("/keys/:keyId/users/:userId", displayBorrowedByUser);

export default userRouter;
