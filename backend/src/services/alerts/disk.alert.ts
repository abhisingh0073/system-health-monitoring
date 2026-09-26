import { ALERT_CONFIG } from "./alert.config";
import {
  getServerUserId,
  getActiveAlert,
  createAlert,
  resolveAlert,
} from "./alert.helper";


const DISK_THRESHOLD = 85;

export async function evaluateDiskAlert(
  userId: string,
  serverId: string,
  diskUsage: number
) {
  
  const alertType = "HIGH_DISK";
  const config = ALERT_CONFIG.HIGH_DISK;

  const activeAlert = await getActiveAlert( serverId,  alertType);

  if (diskUsage >= config.threshold) {

    if (activeAlert) {
      return;
    }

    await createAlert({
      serverId,
      userId,
      alertType: alertType,
      severity: config.severity,
      message: `Disk usage is ${diskUsage.toFixed(2)}%`,
    });

    return;
  }

  if (activeAlert) {
    await resolveAlert({
      alertId: activeAlert.id,
      userId,
    });
  }
}