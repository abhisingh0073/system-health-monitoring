import { off } from "node:cluster";
import { createAlert, getActiveAlert, resolveAlert } from "./alert.helper";
import { ALERT_CONFIG } from "./alert.config";




export async function evaluateOfflineServerAlert(serverId: string, userId: string, offline: boolean) {
    
    const alertType = "SERVER_OFFLINE";
    const config = ALERT_CONFIG.SERVER_OFFLINE;

    const activeAlert = await getActiveAlert(serverId, alertType);

    if(offline){

        if(activeAlert) return;
    
    
        await createAlert({
            serverId,
            userId,
            alertType,
            severity: config.severity,
            message: "Server is offline",
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