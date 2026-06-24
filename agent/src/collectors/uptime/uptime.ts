import os from "os";

export function getUptime(): number{

    const uptime = Math.floor(os.uptime())
    return uptime;
}