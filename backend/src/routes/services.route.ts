import { Router } from "express";
import { postServicesController } from "../controllers/services.conroller";
import { authMiddleWare } from "../middleware/auth.middleware";
import { agentMiddleware } from "../middleware/agent.middleware";

const servicesRouter = Router();

servicesRouter.post("/", agentMiddleware, postServicesController);

export default servicesRouter;