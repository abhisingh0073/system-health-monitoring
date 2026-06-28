import { pool } from "../db";

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
  } catch (error) {
    console.error("Failed to save services:", error);
    throw error;
  }
}



export async function getServerServices(serverId: string) {
  const result = await pool.query(
    `
    SELECT
      id,
      service_name,
      status,
      last_checked
    FROM services
    WHERE server_id = $1
    ORDER BY service_name ASC
    `,
    [serverId]
  );

  return result.rows;
}