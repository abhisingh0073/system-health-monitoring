import { pool } from "../db";


export async function registerServer(hostname: string, ipAddress: string, osName: string, agentVersion:string): Promise<string>{

    const foundIp = await pool.query('SELECT id FROM servers WHERE ip_address = $1', [ipAddress]);
    if(foundIp.rows.length > 0){
        return foundIp.rows[0].id;
    }

    const result  = await pool.query(
        'INSERT INTO servers (hostname, ip_address, os_name, agent_version, status, last_seen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [hostname, ipAddress, osName, agentVersion, 'online', new Date()]
    );

    console.log("server registered data:", result.rows[0]);
    return result.rows[0].id;
}


export async function getAllServers() {
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
  `);

  return result.rows.map(row => ({
    ...row,
    cpu_usage: row.cpu_usage !== null ? Number(row.cpu_usage) : null,
    memory_usage: row.memory_usage !== null ? Number(row.memory_usage) : null,
    disk_usage: row.disk_usage !== null ? Number(row.disk_usage) : null,
  }));
}


export async function getServerById(id: string){
    const result = await pool.query(
        `SELECT * FROM servers WHERE id = $1`, [id]
    )

    return result.rows[0];
}



export async function getServerMetrics(id: string){
    const result = await pool.query(
        `SELECT * FROM metrics WHERE server_id = $1 ORDER BY created_at DESC LIMIT 100`, [id]
    );

    return result.rows.map(row => ({
        ...row,
        cpu_usage: Number(row.cpu_usage),
        memory_usage: Number(row.memory_usage),
        disk_usage: Number(row.disk_usage)
    }));
}