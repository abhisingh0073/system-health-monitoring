import { resolve } from 'node:dns';
import { pool } from '../db';
import { emitMetricsUpdated } from '../socket/emitter';
import { getActiveAlert, resolveAlert } from './alerts/alert.helper';
import { evaluateCpuAlert } from './alerts/cpu.alert';
import { evaluateDiskAlert } from './alerts/disk.alert';
import { evaluateMemoryAlert } from './alerts/memory.alert';
import { METRICS_RANGE_CONFIG, MetricsRange } from './metrics/metrics.config';

export async function postMetrics(serverId: string, userId: string, cpuUsage: number, memoryUsage: number, diskUsage: number, uptimeSeconds: number, networkIn:number, networkOut: number): Promise<number> {
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
                "UPDATE servers SET last_seen = NOW(), status = 'online' WHERE id = $1 RETURNING user_id", [serverId]);



            const offlineAlert = await getActiveAlert(serverId, "SERVER_OFFLINE");
            if(offlineAlert){
                await resolveAlert({
                    alertId: offlineAlert.id,
                    userId,
                })
            }


           
            
            
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
            }, userId);
            
            // evaluating alert based on the threshold if(cpuUsage >= 80)
            
            await evaluateCpuAlert(userId, serverId, cpuUsage);
            await evaluateMemoryAlert(userId, serverId, memoryUsage);
            await evaluateDiskAlert(userId, serverId, diskUsage);

        return metricsResult.rows[0].id;
        
    } catch (error) {
        console.error("Error inserting metrics:", error);
        throw new Error("Internal server error");
    } 
}


export async function getAggregatedMetrics(serverId: string, userId: string, range: MetricsRange) {
    const config = METRICS_RANGE_CONFIG[range];

    const result = await pool.query(
        `SELECT
           date_bin(
             $1::interval,
             m.created_at,
             TIMESTAMP '2000-01-01'
           ) AS timestamp,

           ROUND(AVG(m.cpu_usage)::numeric, 2) AS cpu_usage,
           ROUND(AVG(m.memory_usage)::numeric, 2) AS memory_usage,
           ROUND(AVG(m.disk_usage)::numeric, 2) AS disk_usage,

           AVG(m.network_in) AS network_in,
           AVG(m.network_out) AS network_out

           FROM metrics m

           JOIN servers s
             ON s.id = m.server_id

            WHERE m.server_id = $2
             AND s.user_id = $3
             AND m.created_at >= NOW() - $4::interval

            GROUP BY timestamp

            ORDER BY timestamp ASC
        `,
         [config.bucket, serverId, userId, config.duration]
    );


    return result.rows;
}