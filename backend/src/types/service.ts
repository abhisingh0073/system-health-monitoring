export interface Service {
  id: number;
  service_name: string;
  status: "running" | "stopped" | "not_installed";
  last_checked: string;
}