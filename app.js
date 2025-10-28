import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import getConnection from "./db/connection.js";
import unitRouter from "./routes/unitRoute.js";
import taskRoute from "./routes/taskRoute.js";
import keyRoute from "./routes/keyRoute.js";
import userRouter from "./routes/userRoute.js";
import keyLogRoute from "./routes/keyLogsRoute.js";
import apartmentRoute from "./routes/apartmentRoute.js";
import cronJobRoute from "./routes/cronJobRoute.js";
import qrCodeRoute from "./routes/qrCodeROute.js";
import authRoute from "./routes/authRoute.js";
import { getToken } from "./middleware/authMiddleware.js";
import addressRoute from "./routes/addressRoute.js";
import clokcRoute from "./routes/clockRoute.js";
import workplaceRoute from "./routes/workplaceRoute.js";
import machineRouter from "./routes/machineRoute.js";
import { clearCache } from "./cache/clearCache.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
const PORT = process.env.PORT || 8000;

// Rensa cachen en gång per minut
let lastCleared = 0;
const CLEAR_INTERVAL = 60 * 1000; // 1 minut

app.use((req, res, next) => {
  const now = Date.now();
  if (now - lastCleared > CLEAR_INTERVAL) {
    clearCache();
    lastCleared = now;
  }
  next();
});

app.use("/api", addressRoute);

app.use("/api", authRoute);

// app.use("/api", addressRoute);
app.use("/api", apartmentRoute);
app.use("/api", clokcRoute);

app.use("/api", machineRouter);
app.use("/api", unitRouter);
app.use("/api", workplaceRoute);
app.use("/api", taskRoute);
app.use("/api", qrCodeRoute);
app.use("/api", keyRoute);
app.use("/api", keyLogRoute);
app.use("/api", userRouter);
app.get("*", (req, res) => {
  res.status(200).json({ Message: "HEJ FOLK" });
});
app.use("/api/cronjobs", cronJobRoute);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`The Server listening on port ${PORT}`);
  getConnection();
  import("./cronJobs.js");
});
