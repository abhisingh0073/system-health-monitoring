import axios from "axios"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3456/api"

interface ServiceStatus {
    service: string;
    status: string;
}

interface EnrollmentResponse{
    serverId: string;
    agentToken: string;
}



// export async function registerServer(hostname: string, ipAddress: string, osName: string, agentVersion: string): Promise<string> {
//     const payload = await axios.post(
//         `${API_BASE_URL}/servers/register`,{hostname, ipAddress, osName, agentVersion}
//     );

//     return payload.data.serverId || payload.data.id;
// }


export async function sendMetrics(agentToken: string, cpuUsage: number, memoryUsage: number, diskUsage: number, uptimeSeconds: number, networkIn:Number, networkOut: Number): Promise<void> {
    const payload = await axios.post(
        `${API_BASE_URL}/metrics`, {cpuUsage, memoryUsage, diskUsage, uptimeSeconds, networkIn, networkOut },
        {headers: {
            Authorization: `Bearer ${agentToken}`
        },
    }
    );
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



export async function sendServices(agentToken: string, services: ServiceStatus[]): Promise<void>{
    await axios.post(`${API_BASE_URL}/services`, {services},
        { headers : {
            Authorization: `Bearer ${agentToken}`,
           },
        }
    )
}



export async function connectServer(
    token: string,
    hostname: string,
    ipAddress: string,
    osName: string,
    agentVersion: string
): Promise<EnrollmentResponse>{

    const response = await axios.post(`${API_BASE_URL}/enrollment/connect`, {
        token,
        hostname,
        ipAddress,
        osName,
        agentVersion,
    });

    return response.data.data;
}