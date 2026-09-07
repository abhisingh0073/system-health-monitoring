import {Router} from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getAlertsController } from "../controllers/alert.conroller";

const alertRouter = Router();

alertRouter.get("/", authMiddleWare, getAlertsController);

export default alertRouter;