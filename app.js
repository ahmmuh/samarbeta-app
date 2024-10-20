import express from "express";
import getConnection from "./db/connection.js";
import unitRouter from "./routes/unitRoute.js";
import specialistRoute from "./routes/specialistRoute.js";
import chefRoute from "./routes/chefRoute.js";

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

app.use("/api", unitRouter);
app.use("/api", specialistRoute);
app.use("/api", chefRoute);

app.listen(port, () => {
  console.log(`The Server listening on port ${port}`);
  getConnection();
});
