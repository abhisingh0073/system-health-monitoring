import { Router } from "express";
import { postServicesController } from "../controllers/services.conroller";
import { authMiddleWare } from "../middleware/auth.middleware";

const servicesRouter = Router();

servicesRouter.post("/", authMiddleWare, postServicesController);

export default servicesRouter;