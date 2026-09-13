import { api } from "@/lib/api";
import { Alert } from "@/types/alert";
// import { Alert } from "./alert.service";



type AlertsResponse = {
    success: boolean;
    count: number;
    data: Alert[];
}

export async function getAlertsClient(): Promise<AlertsResponse> {
  return api.get<AlertsResponse>("/alerts");
}