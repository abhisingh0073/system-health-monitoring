import os from "os";
import { getCPUUsage } from "./collectors/cpu/cpu";
import { getDiskUsage } from "./collectors/disk/disk";
import { getHostname } from "./collectors/hostnames/hostname";
import { getMemoryUsage } from "./collectors/memory/memory";
import { getUptime } from "./collectors/uptime/uptime";
import { registerServer, sendMetrics } from "./services/api-client";


async function collectAndSendMetrics(serverId: string){
    try{
        const cpuUsage = await getCPUUsage();
        const memoryUsage =  getMemoryUsage();
        const diskUsage = getDiskUsage();
        const uptimeSeconds =  getUptime();

        console.log("collected metrics", {
            cpuUsage,
            memoryUsage,
            diskUsage,
            uptimeSeconds
        });

        await sendMetrics(
            serverId,
            cpuUsage,
            memoryUsage,
            diskUsage,
            uptimeSeconds
        )

        console.log("Metrics sent successfully");

    } catch (error) {
        console.error("failsed to send metrics:", error);
    }
}




async function startAgent(){
    try{
        console.log("System Health Monitoring Agent Started");

        const hostname= getHostname();

        const ipAddress = Object.values(os.networkInterfaces())
              .flat()
              .find(
              (net) =>
                net &&
                net.family === "IPv4" &&
                !net.internal
            )?.address || "127.0.0.1";

        const serverId = await registerServer(
            hostname,
            ipAddress,
            os.platform(),
            "1.0.0"
        );

        console.log("server registered with id:", serverId);

        await collectAndSendMetrics(serverId);

        setInterval(async () => {
            await collectAndSendMetrics(serverId);
        }, 30000);

    } catch (error) {
        console.error("Error starting agent:", error);
    }
}


startAgent();

