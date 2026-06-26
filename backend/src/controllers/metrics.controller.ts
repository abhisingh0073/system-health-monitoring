import { Request, Response } from 'express';
import { postMetrics } from '../services/metrics.service';
import { PostMetricsSchema } from '../utils/validators';

export async function postMetricsController(req: Request, res: Response): Promise<any> {

    // to check every data should be valid
        const result = PostMetricsSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                success: false,
                message: "validation failed",
                error: result.error.flatten(),
            });
        }

        const {serverId, cpuUsage , memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut} = result.data;


    try{
        const id = await postMetrics(serverId, cpuUsage, memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut);
        res.status(201).json({id});
    } catch (error) {
        console.error("Error posting metrics:", error);
        res.status(500).json({error: "Internal server error"}); 
    }


}