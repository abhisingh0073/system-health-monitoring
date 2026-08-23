import { pool } from "../db";
import { emitServicesUpdated } from "../socket/emitter";

interface ServicesStatus{
    service: string,
    status: string
}

export async function postServices(serverId: string,services: ServicesStatus[]): Promise<void> {
  try {
    for (const service of services) {
      await pool.query(
        `
        INSERT INTO services
        (server_id, service_name, status, last_checked)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (server_id, service_name)
        DO UPDATE SET
          status = EXCLUDED.status,
          last_checked = NOW()
        `,
        [ serverId, service.service, service.status,]
      );
    }

      //websocket
      emitServicesUpdated({
        serverId,
        services,
      });
      
  } catch (error) {
    console.error("Failed to save services:", error);
    throw error;
  }
}



export async function getServerServices(serverId: string, userId: string) {
  const result = await pool.query(
  `SELECT sv.*
    FROM services sv
    INNER JOIN servers s
        ON s.id = sv.server_id
    WHERE sv.server_id = $1
    AND s.user_id = $2
    `,
    [serverId, userId]
  );



  console.log(result);

  return result.rows;
}