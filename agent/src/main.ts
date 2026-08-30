import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
import os from "os";
import { getCPUUsage } from "./collectors/cpu/cpu";
import { getDiskUsage } from "./collectors/disk/disk";
import { getHostname } from "./collectors/hostnames/hostname";
import { getMemoryUsage } from "./collectors/memory/memory";
import { getUptime } from "./collectors/uptime/uptime";
// import { connectServer, sendMetrics, sendServices } from "./services/api-client";
import { connectServer, sendMetrics, sendServices } from "./services/api-client";
import { getNetworkUsage } from "./collectors/network/network";
import { getServicesStatus } from "./collectors/services/services";



async function collectAndSendMetrics(serverId: string, agentToken: string){
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
        console.log("hii")
        console.log(snapshot);

        await sendMetrics(
            agentToken,
            cpuUsage,
            memoryUsage,
            diskUsage,
            uptimeSeconds,
            networkIn,
            networkOut,
        )

        await sendServices(agentToken, snapshot.services);

        console.log("Metrics sent successfully");

    } catch (error) {
        // console.error("failsed to send metrics:", error);
        if (axios.isAxiosError(error)) {
            console.error(
                `[Metrics] Failed: ${error.response?.status} - ${
                    error.response?.data?.message || error.message
                }`
            );
        } else {
            console.error("[Metrics] Unexpected error:", error);
        }
    }
}




async function startAgent(){
    const token = process.env.ENROLLMENT_TOKEN;

    if(!token){
        throw new Error("Enrollment_token is not configured");
    }

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

        const {serverId, agentToken} = await connectServer(
            token,
            hostname,
            ipAddress,
            os.platform(),
            "5.0.0"
        );

        
//         const serverId = await registerServer(
//     hostname,
//     ipAddress,
//     os.platform(),
//     "1.0.0"
// );

        // await collectAndSendMetrics(serverId, agentToken);

        // setInterval(async () => {
        //     await collectAndSendMetrics(serverId);
        // }, metricsInterval);

        await metricsLoop(serverId, metricsInterval, agentToken);

    } catch (error) {
        // console.error("Error starting agent:", error);
        if (axios.isAxiosError(error)) {
            console.error(
                `[Metrics] Failed: ${error.response?.status} - ${
                    error.response?.data?.message || error.message
                }`
            );
        } else {
            console.error("[Metrics] Unexpected error:", error);
        }
    }
}




async function metricsLoop(serverId: string, interval: number, agentToken: string) {
    while (true) {
        await collectAndSendMetrics(serverId, agentToken);

        await new Promise((resolve) =>
            setTimeout(resolve, interval)
        );
    }
}


startAgent();

