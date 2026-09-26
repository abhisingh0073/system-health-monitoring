import { Request, Response } from "express";
import { deleteServer, getAllServers, getServerAlerts, getServerById, getServerMetrics, registerServer } from "../services/server.service";
import { RegisterServerSchema } from "../utils/validators";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { success } from "zod";
import { METRICS_RANGE_CONFIG, MetricsRange } from "../services/metrics/metrics.config";
import { getAggregatedMetrics } from "../services/metrics.service";


export async function registerServerController(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user!.userId;

    const { hostname, ipAddress, osName, agentVersion } = req.body;

    // to check every data should be valid
    const result = RegisterServerSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                success: false,
                message: "validation failed",
                error: result.error.flatten(),
            });
        }

    try{
        const id = await registerServer(hostname, ipAddress, osName, agentVersion, userId)
        res.status(201).json({success: true, serverId: id});
    }
    catch(error){
        res.status(500).json({error: 'Failed to register server'});
    }
}



export async function getAllServersController(req: AuthenticatedRequest, res: Response): Promise<void>{
    try{ 

        console.log("===== GET SERVERS =====");
console.log("User:", req.user);

        const userId = req.user!.userId;

        const data = await getAllServers(userId);
        res.status(201).json({success: true,count:data?.length, data: data})

    } catch(error){
        res.status(500).json({ success: false, message: "Failed to fetch servers"})
    }
}



export async function getServerByIdController(req: AuthenticatedRequest, res:Response){
    const serverId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    try{
        const userId = req.user!.userId;

        if(!userId){
            return res.status(401).json({
                success:false,
                message: "You are not authenticated"
            });
        }

        const data = await getServerById(serverId, userId);

        if(!data) {
            res.status(404).json({success: false, message: "Server not found"});
            return;
        }

        res.status(200).json({success: true, data});

    } catch(error){
        res.status(500).json({error: "failed to fetch server"})
    }
}



export async function getServerMetricsController(req: AuthenticatedRequest, res:Response){
    
    try{
        const serverId = req.params.id as string;
        const userId = req.user!.userId;

        if(!userId){
            return res.status(401).json({
                success: false,
                message: "You are not authenticated"
            })
        }


        const range = (req.query.range as string) || "24h";

        if(!(range in METRICS_RANGE_CONFIG)){
            return res.status(400).json({
                success: false,
                message: "Invalid metrics range",
            })
        }


        const metrics = await getAggregatedMetrics(serverId, userId, range as MetricsRange);

        return res.status(200).json({
            success: true,
            range,
            count: metrics.length,
            data: metrics,
        })

        
    }catch(error){
        console.error("Error fetching server metrics: ", error);
        res.status(500).json({error: " failed to fetch server metrics"})
    }
}



export async function deleteServerController(req: AuthenticatedRequest, res: Response){
    try{
        const serverId = req.params.serverId as string;
        const userId = req.user?.userId;

        if(!userId){
           return res.status(401).json({success: false, message: "you are not authenticated"})
        }

        const deleted = await deleteServer(serverId, userId);

        if(!deleted){
            return res.status(404).json({success: false, message: "Server not found"})
        }


        return res.status(200).json({
            success: true,
            message:"Server deleted successfully"
        });


    } catch(error){
        console.log("Error in deleteserverController ", error);
        res.status(500).json({ success: false, error: "failed to delete this server"});
    }
}



export async function getServerAlertController(req: AuthenticatedRequest, res: Response){
    try{
        const serverId = req.params.id as string;
        const userId = req.user?.userId;

        if(!userId){
            return res.status(401).json({
                success: false,
                message: "You are not authenticated"
            })
        }



        const alerts = await getServerAlerts(serverId, userId);

        return res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts,
        });

    } catch(error){
        console.error("Error fetching server Alerts:", error);


        return res.status(500).json({
            success: false,
            message: "Failed to fetch server alerts",
        });
    }
}

