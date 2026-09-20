import { pool } from "../../db";
import { createAlert, getActiveAlert, getServerUserId, resolveAlert } from "./alert.helper";

const CPU_THRESHOLD = 0;

export async function evaluateCpuAlert(
    serverId: string,
    cpuUsage: number,
) {
    
    const userId = await getServerUserId(serverId);

    const activeAlert = await getActiveAlert(serverId, "HIGH_CPU");

    if(cpuUsage >= CPU_THRESHOLD){
        
        if(activeAlert){
            return;
        }

        await createAlert({
            serverId,
            userId,
            alertType: "HIGH_CPU",
            severity: "warning",
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

