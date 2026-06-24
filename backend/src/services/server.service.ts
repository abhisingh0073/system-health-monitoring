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



export async function getAllServers(){
    try{
     const result =  await pool.query('SELECT * FROM servers ORDER BY created_at DESC');
       return result.rows;

    } catch(error){
        console.error("failed to get all server data from db")
        return;
    }


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

    return result.rows;
}