import dotenv from "dotenv"
dotenv.config();
import { offlineCheck } from "../services/offline.service";


export async function startOfflineChecker(){
    const intervalTime = Number(process.env.OFFLINE_CHECK_INTERVAL_SECONDS || "10")*1000

    setInterval(async () => {
        const count = await offlineCheck();

        if(count && count>0){
            console.log(`${count} servers marked offline`);
        }
    }, intervalTime)
}