import path from "path";
import os from "os";
import { chmod, mkdir, readFile, writeFile } from "fs/promises";


export interface AgentCredentials{
    serverId : string;
    agentToken: string;
}

const CREDENTIALS_DIR = path.join(
    os.homedir(), ".system-health-monitor"
);

const CREDENTIALS_PATH = path.join(
    CREDENTIALS_DIR, "credentials.json"
);

export async function saveCredentials(credentials: AgentCredentials): Promise<void> {
    await mkdir(CREDENTIALS_DIR, { recursive: true});

    await writeFile(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2), "utf-8");

    await chmod(CREDENTIALS_PATH, 0o600);
}



export async function loadCredentials(): Promise<AgentCredentials | null>{
    try{
        const data = await readFile(CREDENTIALS_PATH, "utf-8");

        const credentials = JSON.parse(data);

        if(!credentials.serverId || !credentials.agentToken){
            return null;
        }

        return credentials;
        
    } catch{
        return null;
    }
}