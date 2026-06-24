import { Router } from 'express';
import { postMetricsController } from '../controllers/metrics.controller';


const metricsRouter = Router();
metricsRouter.post('/', postMetricsController);


export default metricsRouter;