import {Router} from 'express';
import { getAllServersController, getServerByIdController, getServerMetricsController, registerServerController } from '../controllers/server.controller';

const serverRouter = Router();
serverRouter.post('/register', registerServerController);
serverRouter.get("/", getAllServersController);
serverRouter.get("/:id", getServerByIdController);
serverRouter.get("/:id/metrics", getServerMetricsController);

export default serverRouter;