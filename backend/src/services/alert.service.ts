import { pool } from "../db";
import { emitAlertCreated, emitAlertResolved } from "../socket/emitter";



const CPU_THRESHOLD = 80;

export async function evaluateCpuAlert(serverId: string, cpuUsage: number): Promise<void>{
    
    const activeAlertResult = await pool.query(
        `SELECT id 
        FROM alerts WHERE server_id = $1 AND alert_type = 'HIGH_CPU'
        AND status = 'active'
        LIMIT 1`, [serverId]
    );


    const activeAlert = activeAlertResult.rows[0];

    if(cpuUsage >= CPU_THRESHOLD){
        
        if(activeAlert){
            return;
        }

        const result = await pool.query(
            `INSERT INTO alerts 
            (server_id, alert_type, severity, message, status)
            VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
            [serverId, "HIGH_CPU", "warning", `CPU usage is ${cpuUsage.toFixed(2)}%`]
        );

        const alert = result.rows[0];

        emitAlertCreated(alert);

        return;
    }


    if(activeAlert){

        const result = await pool.query(
            `UPDATE alerts
            SET status = 'resolved', resolved_at = NOW()
            WHERE id = $1
            RETURNING *`, [activeAlert.id]
        );

        const alert = result.rows[0];

        emitAlertResolved(alert);
    }
}


export async function getAlerts(userId: string) {
    const result = await pool.query(
        `SELECT a.id, 
        a.server_id, 
        a.alert_type
        a.severity,
        a.message,
        a.status,
        a.triggered_at,
        a.resolved_at
        FROM alerts a 
        JOIN servers s
        ON a.server_id = s.id
        WHERE s.user_id = $1
        ORDER BY a.triggered_at DESC`, [userId]
    )
    return result.rows;
}