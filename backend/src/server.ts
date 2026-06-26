import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db";
import serverRouter from "./routes/server.routes";
import metricsRouter from "./routes/metrics.route";
import { startOfflineChecker } from "./jobs/offline-checker";
import servicesRouter from "./routes/services.route";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;


// APIs
app.use("/api/servers", serverRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/services", servicesRouter)




async function startServer(){
  try{
    await connectToDatabase();
    startOfflineChecker();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch(error){
    console.error("Application startup failed" , error);

    process.exit(1);
  }
}


startServer();



