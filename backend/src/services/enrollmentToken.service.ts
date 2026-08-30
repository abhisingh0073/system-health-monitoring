import { pool } from "../db";
import { generateAgentToken } from "../lib/agent-token";
import { generateEnrollmentToken, hashEnrollmentToken } from "../lib/enrollment-token";
import { saveAgentToken } from "./agent-token.service";

interface ConnectServerData{
    token: string,
    hostname: string;
    ipAddress: string;
    osName: string;
    agentVersion: string;
}



export async function createEnrollmentToken(userId: string){
    const token = generateEnrollmentToken();
    const tokenHash = hashEnrollmentToken(token);
    
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(`INSERT INTO enrollment_tokens (user_id, token_hash, expires_at) VALUEs ($1, $2, $3)`, [userId, tokenHash, expiresAt]);

    return{
        token,
        expiresAt,
    }
}




export async function connectServerWithEnrollmentToken(data: ConnectServerData){
    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        const tokenHash = hashEnrollmentToken(data.token);

        const tokenResult = await client.query(
            `SELECT id, user_id, expires_at, used_at FROM enrollment_tokens WHERE token_hash = $1 FOR UPDATE`, [tokenHash]
        );

        if(tokenResult.rows.length === 0){
            throw new Error("Invalid enrollment token");
        }

        const enrollmentToken = tokenResult.rows[0];

        if(enrollmentToken.used_at){
            throw new Error("Enrollment token has already been used");
        }

        if(new Date(enrollmentToken.expires_at)<new Date()){
            throw new Error("Enrollment token has expired");
        }

        const serverResult = await client.query(
            `INSERT INTO servers
            (
              hostname,
              ip_address,
              os_name,
              agent_version,
              user_id,
              status,
              last_seen
            ) 
            VALUES ($1, $2, $3, $4, $5, 'online', NOW()) RETURNING id  
            `, [
                data.hostname,
                data.ipAddress,
                data.osName,
                data.agentVersion,
                enrollmentToken.user_id,
            ]
        );

        const server = serverResult.rows[0];


        await client.query(
            `
             UPDATE enrollment_tokens SET used_at = NOW() WHERE id = $1
            `, [enrollmentToken.id]
        );

        await client.query("COMMIT");

        // this is use to create unique agent token for this server 
        const agentToken = generateAgentToken();

        saveAgentToken(server.id, agentToken); // it use to save the agent token  in map

        return {server, agentToken};

    } catch(error){
        await client.query("ROLLBACK");

        throw error;

    } finally{

        client.release();
    }

}