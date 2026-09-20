import {
  getServerUserId,
  getActiveAlert,
  createAlert,
  resolveAlert,
} from "./alert.helper";


const DISK_THRESHOLD = 85;

export async function evaluateDiskAlert(
  serverId: string,
  diskUsage: number
) {
  const userId = await getServerUserId(serverId);

  const activeAlert = await getActiveAlert(
    serverId,
    "HIGH_DISK"
  );

  if (diskUsage >= DISK_THRESHOLD) {

    if (activeAlert) {
      return;
    }

    await createAlert({
      serverId,
      userId,
      alertType: "HIGH_DISK",
      severity: "warning",
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