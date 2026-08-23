import { Request, Response } from "express";
import { getServerServices, postServices } from "../services/services.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";


export async function postServicesController(req:Request, res:Response): Promise<void> {

    const {serverId, services} = req.body;

    try{
        await postServices(serverId, services);

        res.status(200).json({
            success: true,
            message: "Services updated",
        })
    } catch(error){
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to update services",
        })
    }
}





export async function getServerServicesController(req: AuthenticatedRequest,res: Response): Promise<void> {
  try {
    const serverId = req.params.id as string;
    const userId = req.user!.userId;

    const services = await getServerServices(serverId, userId);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
}