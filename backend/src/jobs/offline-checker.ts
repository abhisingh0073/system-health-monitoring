import dotenv from "dotenv"
dotenv.config();
import { offlineCheck } from "../services/offline.service";


export async function startOfflineChecker(){
    const intervalTime = Number(process.env.OFFLINE_THRESHOLD_MINUTES || "1")*1000*60

    setInterval(async () => {
        const count = await offlineCheck();

        if(count && count>0){
            console.log(`${count} servers marked offline`);
        }
    }, intervalTime)
}