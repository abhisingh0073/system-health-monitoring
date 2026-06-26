import dotenv from "dotenv";
dotenv.config();
import os from "os";
import { getCPUUsage } from "./collectors/cpu/cpu";
import { getDiskUsage } from "./collectors/disk/disk";
import { getHostname } from "./collectors/hostnames/hostname";
import { getMemoryUsage } from "./collectors/memory/memory";
import { getUptime } from "./collectors/uptime/uptime";
import { registerServer, sendMetrics, sendServices } from "./services/api-client";
import { getNetworkUsage } from "./collectors/network/network";
import { getServicesStatus } from "./collectors/services/services";


async function collectAndSendMetrics(serverId: string){
    try{
        const cpuUsage = await getCPUUsage();
        const memoryUsage =  getMemoryUsage();
        const diskUsage = getDiskUsage();
        const uptimeSeconds =  getUptime();

        const {networkIn, networkOut} = getNetworkUsage();

        const services = getServicesStatus();

        const snapshot = {
            cpuUsage,
            memoryUsage,
            diskUsage,
            uptimeSeconds,
            networkIn,
            networkOut,
            services,
        };

        console.log(snapshot);

        await sendMetrics(
            serverId,
            cpuUsage,
            memoryUsage,
            diskUsage,
            uptimeSeconds,
            networkIn,
            networkOut,
        )

        await sendServices(serverId, snapshot.services);

        console.log("Metrics sent successfully");

    } catch (error) {
        console.error("failsed to send metrics:", error);
    }
}




async function startAgent(){

    const metricsInterval = Number(process.env.METRIC_INTERVAL_SECONDS || 30) * 1000
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
        }, metricsInterval);

    } catch (error) {
        console.error("Error starting agent:", error);
    }
}


startAgent();

