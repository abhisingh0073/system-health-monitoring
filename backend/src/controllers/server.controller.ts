import { Request, Response } from "express";
import { getAllServers, getServerById, getServerMetrics, registerServer } from "../services/server.service";
import { RegisterServerSchema } from "../utils/validators";


export async function registerServerController(req: Request, res: Response): Promise<any> {
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
        const id = await registerServer(hostname, ipAddress, osName, agentVersion)
        res.status(201).json({success: true, serverId: id});
    }
    catch(error){
        res.status(500).json({error: 'Failed to register server'});
    }
}




export async function getAllServersController(req: Request, res: Response): Promise<void>{
    try{
        const data = await getAllServers();
        res.status(201).json({success: true,count:data?.length, data: data})

    } catch(error){
        res.status(500).json({ success: false, message: "Failed to fetch servers"})
    }
}



export async function getServerByIdController(req: Request, res:Response):Promise<void>{
    const id = req.params.id as string;

    try{
        const data = await getServerById(id);

        if(!data) {
            res.status(404).json({success: false, message: "Server not found"});
            return;
        }

        res.status(200).json({success: true, data});
    } catch(error){
        res.status(500).json({error: "failed to get data from id"})
    }
}



export async function getServerMetricsController(req: Request, res:Response): Promise<void>{
    const id = req.params.id as string;

    try{
        const data = await getServerMetrics(id);

        if(!data){
            res.status(404).json({success:false, message: "Server not found" })
            return;
        }

        res.status(200).json({success: true, data});
    }catch(error){
        res.status(500).json({error: " failed to load the data"})
    }
}

