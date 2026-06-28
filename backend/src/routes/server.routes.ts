import {Router} from 'express';
import { getAllServersController, getServerByIdController, getServerMetricsController, registerServerController } from '../controllers/server.controller';
import { getServerServicesController } from '../controllers/services.conroller';

const serverRouter = Router();
serverRouter.post('/register', registerServerController);
serverRouter.get("/", getAllServersController);
serverRouter.get("/:id", getServerByIdController);
serverRouter.get("/:id/metrics", getServerMetricsController);
serverRouter.get("/:id/services", getServerServicesController);

export default serverRouter;