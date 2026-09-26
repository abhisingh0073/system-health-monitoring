import {Router} from 'express';
import { deleteServerController, getAllServersController, getServerAlertController, getServerByIdController, getServerMetricsController, registerServerController } from '../controllers/server.controller';
import { getServerServicesController } from '../controllers/services.conroller';
import { authMiddleWare } from '../middleware/auth.middleware';

const serverRouter = Router();
// serverRouter.post('/register', authMiddleWare, registerServerController);
serverRouter.get("/", authMiddleWare,  getAllServersController);
serverRouter.get("/:id/metrics", authMiddleWare,  getServerMetricsController);
serverRouter.get("/:id/services", authMiddleWare,  getServerServicesController);
serverRouter.get("/:id/alerts", authMiddleWare, getServerAlertController)
serverRouter.get("/:id", authMiddleWare,  getServerByIdController);

serverRouter.delete("/:serverId", authMiddleWare, deleteServerController)

export default serverRouter;