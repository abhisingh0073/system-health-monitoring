import { createAlert, getActiveAlert, getServerUserId, resolveAlert } from "./alert.helper";


export async function evaluteServiceAlert(
    serverId: string,
    serviceName: string,
    status: string
) {
    
    const userId = await getServerUserId(serverId);

    const alertType = "SERVICE_DOWN";

    const activeAlert = await getActiveAlert(
        serverId,
        `${alertType}: ${serviceName}`
    )

    if(status !== "active"){
        if(activeAlert){
            return;
        }

        await createAlert({
            serverId,
            userId,
            alertType: "SERVICE_DOWN",
            severity: "critical",
            message: `Service ${serviceName} is down`,
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