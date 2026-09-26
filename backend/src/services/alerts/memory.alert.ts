import { ALERT_CONFIG } from "./alert.config";
import { createAlert, getActiveAlert, getServerUserId, resolveAlert } from "./alert.helper";


const MEMORY_THRESHOLD = 80;

export async function evaluateMemoryAlert(userId: string, serverId:string, memeoryUsage: number) {
    
    const alertType = "HIGH_MEMORY";
    const config = ALERT_CONFIG.HIGH_MEMORY;

    const activeAlert = await getActiveAlert(serverId, alertType);

    if(memeoryUsage >= config.threshold){
        
        if(activeAlert){
            return;
        }

        await createAlert({
            serverId,
            userId,
            alertType,
            severity: config.severity,
            message: `Memory usage is ${memeoryUsage.toFixed(2)}%`
        })
    }



    if(activeAlert){
        await resolveAlert({
            alertId: activeAlert.id,
            userId,
        });
    }

}