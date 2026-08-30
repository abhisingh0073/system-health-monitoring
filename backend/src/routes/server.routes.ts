import {Router} from 'express';
import { getAllServersController, getServerByIdController, getServerMetricsController, registerServerController } from '../controllers/server.controller';
import { getServerServicesController } from '../controllers/services.conroller';
import { authMiddleWare } from '../middleware/auth.middleware';

const serverRouter = Router();
// serverRouter.post('/register', authMiddleWare, registerServerController);
serverRouter.get("/", authMiddleWare,  getAllServersController);
serverRouter.get("/:id", authMiddleWare,  getServerByIdController);
serverRouter.get("/:id/metrics", authMiddleWare,  getServerMetricsController);
serverRouter.get("/:id/services", authMiddleWare,  getServerServicesController);

export default serverRouter;