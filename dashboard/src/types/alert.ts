export type Alert = {
    id: number;
    server_id: string;
    hostname: string;
    alert_type: string;
    severity: string;
    message: string;
    status: "active" | "resolved";
    triggered_at: string;
    resolved_at: string | null;
}