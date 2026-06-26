import { Request, Response } from "express";
import { postServices } from "../services/services.service";


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