import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getAlerts } from "../services/alert.service";


export async function getAlertsController(req: AuthenticatedRequest, res: Response): Promise<void>{
    try{
        const userId = req.user!.userId;

        const alerts = await getAlerts(userId);

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts,
        });

    } catch(error){
        console.error("Failed to fetch alerts: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts",
        });
    }
}