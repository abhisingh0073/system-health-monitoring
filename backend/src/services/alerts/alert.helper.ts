import { pool } from "../../db";
import { emitAlertCreated, emitAlertResolved } from "../../socket/emitter";


export async function getServerUserId(serverId:string): Promise<string> {
   
    const result = await pool.query(
        `SELECT user_id FROM servers WHERE id=$1`, [serverId]
    );

    const userId = result.rows[0].user_id;

    if(!userId){
        throw new Error(
            `User not found for Server in alert-helper ${serverId}`
        )
    }

    return userId;
}



export async function getActiveAlert(serverId:string, alertType: string, serviceName?: string) {

    const result = await pool.query(
        `SELECT id FROM alerts WHERE server_id=$1 
         AND alert_type=$2
         AND status = 'active'
         AND (
            service_name = $3
            OR ($3 IS NULL AND service_name IS NULL)
         )
         LIMIT 1
        `, [serverId, alertType, serviceName ?? null]
    );

    return result.rows[0] ?? null;
    
}




export async function createAlert({serverId, userId, alertType, severity, message, serviceName}:{
    serverId: string;
    userId: string;
    alertType: string;
    severity: string;
    message: string;
    serviceName?: string;
  }){
    const result = await pool.query(
        `INSERT INTO alerts (server_id, alert_type, service_name, severity, message, status)
        VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *
        `, [serverId, alertType, serviceName ?? null, severity, message]
    );


    const alert = result.rows[0];

    emitAlertCreated(alert, userId);

    return alert;
}



export async function resolveAlert({alertId, userId}: {
    alertId: number;
    userId: string;
  }){
    const result = await pool.query(
        ` UPDATE alerts SET status = 'resolved',
          resolved_at = NOW()
          WHERE id=$1
          RETURNING *
        `, [alertId]
    );

    const alert = result.rows[0];

    if(alert){
        emitAlertResolved(alert, userId);
    }

    return alert;
}