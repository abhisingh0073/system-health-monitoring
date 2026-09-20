import { createAlert, getActiveAlert, getServerUserId, resolveAlert } from "./alert.helper";


const MEMORY_THRESHOLD = 0;

export async function evaluateMemoryAlert(serverId:string, memeoryUsage: number) {
    
    const userId = await getServerUserId(serverId);

    const activeAlert = await getActiveAlert(serverId, "HIGH_MEMORY");

    if(memeoryUsage >= MEMORY_THRESHOLD){
        
        if(activeAlert){
            return;
        }

        await createAlert({
            serverId,
            userId,
            alertType: "HIGH_MEMORY",
            severity: "warning",
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