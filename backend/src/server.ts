import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db";
import serverRouter from "./routes/server.routes";
import metricsRouter from "./routes/metrics.route";
import { startOfflineChecker } from "./jobs/offline-checker";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import servicesRouter from "./routes/services.route";
import { initializeSocket } from "./socket/socket";
import authRouter from "./routes/auth.route";
import enrollmentRouter from "./routes/enrollmentRouter";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3456;


// APIs
app.use("/api/servers", serverRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/auth", authRouter);
app.use("/api/enrollment", enrollmentRouter);




async function startServer(){
  try{
    await connectToDatabase();
    startOfflineChecker();
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })


  } catch(error){
    console.error("Application startup failed" , error);

    process.exit(1);
  }
}


startServer();



