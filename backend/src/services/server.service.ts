import { pool } from "../db";


export async function registerServer(hostname: string, ipAddress: string, osName: string, agentVersion:string, userId:string): Promise<string>{

    const foundIp = await pool.query('SELECT id FROM servers WHERE ip_address = $1', [ipAddress]);
    if(foundIp.rows.length > 0){
        return foundIp.rows[0].id;
    }

    const result  = await pool.query(
        'INSERT INTO servers (hostname, ip_address, os_name, agent_version, status, last_seen, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [hostname, ipAddress, osName, agentVersion, 'online', new Date(), userId]
    );

    console.log("server registered data:", result.rows[0]);
    return result.rows[0].id;
}


export async function getAllServers(userId: string) {
  const result = await pool.query(`
    SELECT
      s.id,
      s.hostname,
      s.status,
      s.last_seen,
      s.ip_address,
      m.cpu_usage,
      m.memory_usage,
      m.disk_usage
    FROM servers s
    LEFT JOIN LATERAL (
      SELECT
        cpu_usage,
        memory_usage,
        disk_usage
      FROM metrics
      WHERE server_id = s.id
      ORDER BY created_at DESC
      LIMIT 1
    ) m ON true

    WHERE s.user_id = $1
    ORDER BY s.created_at DESC
  `, [userId]);

  return result.rows.map(row => ({
    ...row,
    cpu_usage: row.cpu_usage !== null ? Number(row.cpu_usage) : null,
    memory_usage: row.memory_usage !== null ? Number(row.memory_usage) : null,
    disk_usage: row.disk_usage !== null ? Number(row.disk_usage) : null,
  }));
}


export async function getServerById(serverId: string, userId: string){
    const result = await pool.query(
        `SELECT * FROM servers WHERE id = $1 AND user_id = $2`, [serverId, userId]
    )

    return result.rows[0] ?? null;
}



export async function getServerMetrics(serverId: string, userId: string){
    const result = await pool.query(
          `SELECT m.* FROM metrics m
           INNER JOIN servers s
               ON s.id = m.server_id
           WHERE m.server_id = $1 AND s.user_id = $2
           ORDER BY m.created_at DESC
           LIMIT 100
           `,
           [serverId, userId]
       );

    return result.rows.map(row => ({
        ...row,
        cpu_usage: Number(row.cpu_usage),
        memory_usage: Number(row.memory_usage),
        disk_usage: Number(row.disk_usage)
    }));
}