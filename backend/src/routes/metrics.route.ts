import { Router } from 'express';
import { postMetricsController } from '../controllers/metrics.controller';
import { agentMiddleware } from '../middleware/agent.middleware';


const metricsRouter = Router();
metricsRouter.post('/', agentMiddleware, postMetricsController);


export default metricsRouter;