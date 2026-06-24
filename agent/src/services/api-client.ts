import axios from "axios"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3456/api"

export async function registerServer(hostname: string, ipAddress: string, osName: string, agentVersion: string): Promise<string> {
    const payload = await axios.post(
        `${API_BASE_URL}/servers/register`,{hostname, ipAddress, osName, agentVersion}
    );

    return payload.data.serverId || payload.data.id;
}


export async function sendMetrics(serverId: string, cpuUsage: number, memoryUsage: number, diskUsage: number, uptimeSeconds: number): Promise<void> {
    const payload = await axios.post(
        `${API_BASE_URL}/metrics`, { serverId, cpuUsage, memoryUsage, diskUsage, uptimeSeconds }
    );
}