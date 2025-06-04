import express from "express";
import { getToken } from "../middleware/authMiddleware.js";
import {
  getCurrentUser,
  // logout,
  signIn,
  signUp,
} from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.get("/users/me", getToken, getCurrentUser);

authRoute.post("/users/auth/signUp", signUp);
authRoute.post("/users/auth/login", signIn);
// authRoute.post("/users/auth/logout", getToken, logout);

export default authRoute;
