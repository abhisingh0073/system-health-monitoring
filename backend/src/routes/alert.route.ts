import {Router} from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getAlertsController } from "../controllers/alert.conroller";
import { getServerAlertController } from "../controllers/server.controller";

const alertRouter = Router();

alertRouter.get("/", authMiddleWare, getAlertsController);
alertRouter.get("/:id/", authMiddleWare, getServerAlertController)

export default alertRouter;