import express from "express";
import { getAllkeys } from "../controllers/KeyController";

const keyRoute = express.Router();

keyRoute.get("/keys", getAllkeys);
