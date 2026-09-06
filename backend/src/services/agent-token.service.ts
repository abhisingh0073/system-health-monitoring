import crypto from "crypto";
import { pool } from "../db";


export async function saveAgentToken(serverId: string, hashAgentToken: string): Promise<void> {
            await pool.query(`UPDATE servers SET  agent_token_hash = $1 WHERE
                id = $2`, [hashAgentToken, serverId]);

}


export async function getServerIdByAgentToken( agentToken: string): Promise<string | undefined> {

    const agentTokenHash = hashAgentToken(agentToken);

    const result = await pool.query(
        `SELECT id FROM servers WHERE agent_token_hash = $1`, [agentTokenHash]
    );

    if(result.rows.length === 0){
        return undefined;
    }

    return result.rows[0].id;
}
 

export async function removeAgentToken( serverId: string): Promise<void> {
    
    await pool.query(`UPDATE servers SET agent_token_hash = NULL WHERE id = $1`, [serverId]);
}



export function hashAgentToken(token: string): string{
    return crypto.createHash("sha256").update(token).digest("hex");
}