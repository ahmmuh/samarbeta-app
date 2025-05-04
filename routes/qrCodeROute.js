import express from "express";
import { registerNewKey } from "../controllers/QRController.js";

const qrCodeRoute = express.Router();

qrCodeRoute.post("/keys/qrcode", registerNewKey);

export default qrCodeRoute;
