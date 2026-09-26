"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const os_1 = __importDefault(require("os"));
const cpu_1 = require("./collectors/cpu/cpu");
const disk_1 = require("./collectors/disk/disk");
const hostname_1 = require("./collectors/hostnames/hostname");
const memory_1 = require("./collectors/memory/memory");
const uptime_1 = require("./collectors/uptime/uptime");
// import { connectServer, sendMetrics, sendServices } from "./services/api-client";
const api_client_1 = require("./services/api-client");
const network_1 = require("./collectors/network/network");
const services_1 = require("./collectors/services/services");
const credentials_service_1 = require("./services/credentials.service");
async function collectAndSendMetrics(serverId, agentToken) {
    try {
        const cpuUsage = await (0, cpu_1.getCPUUsage)();
        const memoryUsage = (0, memory_1.getMemoryUsage)();
        const diskUsage = (0, disk_1.getDiskUsage)();
        const uptimeSeconds = (0, uptime_1.getUptime)();
        const { networkIn, networkOut } = (0, network_1.getNetworkUsage)();
        const services = (0, services_1.getServicesStatus)();
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
        await (0, api_client_1.sendMetrics)(agentToken, cpuUsage, memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut);
        await (0, api_client_1.sendServices)(agentToken, snapshot.services);
        console.log("Metrics sent successfully");
    }
    catch (error) {
        // console.error("failsed to send metrics:", error);
        if (axios_1.default.isAxiosError(error)) {
            console.error(`[Metrics] Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
        else {
            console.error("[Metrics] Unexpected error:", error);
        }
    }
}
async function startAgent() {
    const metricsInterval = Number(process.env.METRIC_INTERVAL_SECONDS || 30) * 1000;
    try {
        console.log("System Health Monitoring Agent Started");
        const credentials = await (0, credentials_service_1.loadCredentials)();
        if (credentials) {
            console.log("Existing server credentials found");
            await metricsLoop(credentials.serverId, metricsInterval, credentials.agentToken);
            return;
        }
        const token = process.env.ENROLLMENT_TOKEN;
        if (!token) {
            throw new Error("Enrollment_token is not configured");
        }
        const hostname = (0, hostname_1.getHostname)();
        const ipAddress = Object.values(os_1.default.networkInterfaces())
            .flat()
            .find((net) => net &&
            net.family === "IPv4" &&
            !net.internal)?.address || "127.0.0.1";
        const { serverId, agentToken } = await (0, api_client_1.connectServer)(token, hostname, ipAddress, os_1.default.platform(), "5.0.0");
        ///// SAVING CREDENTIALS LOCALLY IN JASON FILE ///////
        await (0, credentials_service_1.saveCredentials)({ serverId, agentToken });
        console.log("Agent enrolled successfully with server");
        await metricsLoop(serverId, metricsInterval, agentToken);
    }
    catch (error) {
        // console.error("Error starting agent:", error);
        if (axios_1.default.isAxiosError(error)) {
            console.error(`[Metrics] Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
        else {
            console.error("[Metrics] Unexpected error:", error);
        }
    }
}
async function metricsLoop(serverId, interval, agentToken) {
    while (true) {
        await collectAndSendMetrics(serverId, agentToken);
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}
startAgent();
