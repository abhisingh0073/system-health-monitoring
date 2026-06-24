import { Request, Response } from 'express';
import { postMetrics } from '../services/metrics.service';

export async function postMetricsController(req: Request, res: Response): Promise<void> {
    const {serverId, cpuUsage , memoryUsage, diskUsage, uptimeSeconds} = req.body;

    if(!serverId || cpuUsage === undefined || memoryUsage === undefined || diskUsage === undefined || uptimeSeconds === undefined){
        res.status(400).json({error: "Missing required fields"});
        return;
    }

    try{
        const id = await postMetrics(serverId, cpuUsage, memoryUsage, diskUsage, uptimeSeconds);
        res.status(201).json({id});
    } catch (error) {
        console.error("Error posting metrics:", error);
        res.status(500).json({error: "Internal server error"}); 
    }


}