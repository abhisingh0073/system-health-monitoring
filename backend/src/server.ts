import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db";
import serverRouter from "./routes/server.routes";
import metricsRouter from "./routes/metrics.route";
import { startOfflineChecker } from "./jobs/offline-checker";
import http from "http";
import { createServer } from "http";
import servicesRouter from "./routes/services.route";
import { initializeSocket } from "./socket/socket";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

const PORT = process.env.PORT || 3456;


// APIs
app.use("/api/servers", serverRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/services", servicesRouter)




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



