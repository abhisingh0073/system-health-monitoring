import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db";
import serverRouter from "./routes/server.routes";
import metricsRouter from "./routes/metrics.route";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

connectToDatabase();


app.use("/api/servers", serverRouter);
app.use("/api/metrics", metricsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});