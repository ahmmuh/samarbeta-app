import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import getConnection from "./db/connection.js";
import unitRouter from "./routes/unitRoute.js";
import specialistRoute from "./routes/specialistRoute.js";
import chefRoute from "./routes/chefRoute.js";
import taskRoute from "./routes/taskRoute.js";
import workplaceRoute from "./routes/workplaceRoute.js";
import googlePlaceRoute from "./routes/googlePlaceRoute.js";
import keyRoute from "./routes/keyRoute.js";
import userRouter from "./routes/userRoute.js";
import keyLogRoute from "./routes/keyLogsRoute.js";
import apartmentRoute from "./routes/apartmentRoute.js";
const app = express();
const port = 8000;

app.use(express.json());
// app.use((req, res, next) => {
//   console.log("Incoming request method:", req.method); // Loggar HTTP-metoden
//   console.log("Incoming request URL:", req.url); // Loggar URL
//   console.log("Incoming request headers:", req.headers); // Loggar headers
//   console.log("Incoming request body:", req.body); // Loggar body
//   next();
// });
app.use(cors());
app.use("/api", userRouter);
app.use("/api", unitRouter);
app.use("/api", specialistRoute);
app.use("/api", chefRoute);
app.use("/api", taskRoute);
app.use("/api", googlePlaceRoute);
app.use("/api", workplaceRoute);
app.use("/api", keyRoute);
app.use("/api", keyLogRoute);
app.use("/api", apartmentRoute);
// Optional logging middleware (can be uncommented for debugging)
// app.use((req, res, next) => {
//   console.log("Incoming request method:", req.method); // Log the HTTP method
//   console.log("Incoming request URL:", req.url); // Log the request URL
//   console.log("Incoming request headers:", req.headers); // Log the request headers
//   console.log("Incoming request body:", req.body); // Log the request body
// next(); // Pass control to the next middleware or route handler
// });
app.listen(port, () => {
  console.log(`The Server listening on port ${port}`);
  getConnection();
});
