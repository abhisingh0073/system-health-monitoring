import { pool } from "../../db";
import { ALERT_CONFIG } from "./alert.config";
import { createAlert, getActiveAlert, resolveAlert } from "./alert.helper";


export async function evaluateCpuAlert(
    userId: string,
    serverId: string,
    cpuUsage: number,
) {
    
   const alertType = "HIGH_CPU";
   const config = ALERT_CONFIG.HIGH_CPU;

    const activeAlert = await getActiveAlert(serverId, alertType);

    if(cpuUsage >= config.threshold){
        
        if(activeAlert){
            return;
        }

        await createAlert({
            serverId,
            userId,
            alertType: alertType,
            severity: config.severity,
            message: `CPU usage is ${cpuUsage.toFixed(2)}%`
        });

        return;
    }


    if(activeAlert){
        await resolveAlert({
            alertId: activeAlert.id,
            userId,
        });
    }
}

