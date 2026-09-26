"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMetrics = sendMetrics;
exports.sendServices = sendServices;
exports.connectServer = connectServer;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3456/api";
// export async function registerServer(hostname: string, ipAddress: string, osName: string, agentVersion: string): Promise<string> {
//     const payload = await axios.post(
//         `${API_BASE_URL}/servers/register`,{hostname, ipAddress, osName, agentVersion}
//     );
//     return payload.data.serverId || payload.data.id;
// }
async function sendMetrics(agentToken, cpuUsage, memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut) {
    const payload = await axios_1.default.post(`${API_BASE_URL}/metrics`, { cpuUsage, memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut }, { headers: {
            Authorization: `Bearer ${agentToken}`
        },
    });
}
// export async function sendMetrics(serverId: string,agentToken: string, cpuUsage: number, memoryUsage: number, diskUsage: number, uptimeSeconds: number, networkIn:Number, networkOut: Number): Promise<void> {
//     const payload = await axios.post(
//         `${API_BASE_URL}/metrics`, { serverId, cpuUsage, memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut },
//         {headers: {
//             Authorization: `Bearer ${agentToken}`
//         },
//     }
//     );
// }
async function sendServices(agentToken, services) {
    await axios_1.default.post(`${API_BASE_URL}/services`, { services }, { headers: {
            Authorization: `Bearer ${agentToken}`,
        },
    });
}
async function connectServer(token, hostname, ipAddress, osName, agentVersion) {
    const response = await axios_1.default.post(`${API_BASE_URL}/enrollment/connect`, {
        token,
        hostname,
        ipAddress,
        osName,
        agentVersion,
    });
    return response.data.data;
}
