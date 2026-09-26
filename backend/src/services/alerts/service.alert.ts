import { ALERT_CONFIG } from "./alert.config";
import { createAlert, getActiveAlert, getServerUserId, resolveAlert } from "./alert.helper";


export async function evaluateServiceAlert(
    serverId: string,
    userId: string,
    serviceName: string,
    status: string
) {
   
    const alertType = "SERVICE_DOWN";
    const config = ALERT_CONFIG.SERVICE_DOWN

    const activeAlert = await getActiveAlert(
        serverId,
        alertType,
        serviceName
    )

    if(status !== "running"){
        if(activeAlert){
            return;
        }

        await createAlert({
            serverId,
            userId,
            alertType,
            serviceName,
            severity: config.severity,
            message: `Service ${serviceName} is stopped`,
        });


        return;
    }



    if(activeAlert){
        await resolveAlert({
            alertId: activeAlert.id,
            userId,
        })
    }
}