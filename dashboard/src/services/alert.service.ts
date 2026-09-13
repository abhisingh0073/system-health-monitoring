// import { api } from "@/lib/api";
import { serverApi } from "@/lib/server-api";
import { Alert } from "@/types/alert";


type AlertsResponse = {
    success: boolean;
    count: number;
    data: Alert[];
}

export async function getAlerts(): Promise<AlertsResponse>{
    return serverApi<AlertsResponse>("/alerts");
}


