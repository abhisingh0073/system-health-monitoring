import { serverApi } from "@/lib/server-api";

export type Alert = {
    id: number;
    server_id: string;
    alert_type: string;
    severity: string;
    message: string;
    status: "active" | "resolved";
    triggered_at: string;
    resolved_at: string | null;
}

type AlertsResponse = {
    success: boolean;
    count: number;
    data: Alert[];
}

export async function getAlerts(): Promise<AlertsResponse>{
    return serverApi<AlertsResponse>("/alerts");
}