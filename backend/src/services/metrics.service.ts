import { pool } from '../db';
import { emitMetricsUpdated } from '../socket/emitter';
import { evaluateCpuAlert } from './alert.service';

export async function postMetrics(serverId: string, cpuUsage: number, memoryUsage: number, diskUsage: number, uptimeSeconds: number, networkIn:number, networkOut: number): Promise<number> {
    try{
        const metricsResult = await pool.query(
          `INSERT INTO metrics
            ( server_id, cpu_usage, memory_usage, disk_usage, uptime_seconds, network_in, network_out )
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
                  [
                    serverId,
                    cpuUsage,
                    memoryUsage,
                    diskUsage,
                    uptimeSeconds,
                    networkIn,
                    networkOut
                  ]);
             
            // updating server is live and last seen time
            await pool.query(
                "UPDATE servers SET last_seen = NOW(), status = 'online' WHERE id = $1", [serverId]);
            
            // evaluatiing cpu alert based on the threshold if(cpuUsage >= 80) 
            await evaluateCpuAlert(serverId, cpuUsage);


            // Sending live data to the frontend via socket.io
            emitMetricsUpdated({
                serverId,
                cpuUsage,
                memoryUsage,
                diskUsage,
                uptimeSeconds,
                networkIn,
                networkOut,
                created_at: metricsResult.rows[0].created_at,
            })

        return metricsResult.rows[0].id;
        
    } catch (error) {
        console.error("Error inserting metrics:", error);
        throw new Error("Internal server error");
    } 
}