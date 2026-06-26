import { Router } from "express";
import { postServicesController } from "../controllers/services.conroller";

const servicesRouter = Router();

servicesRouter.post("/", postServicesController);

export default servicesRouter;