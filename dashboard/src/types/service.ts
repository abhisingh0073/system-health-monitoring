export type ServiceStatus = "running" | "stopped" | "not_installed";

export interface Service {
  id: number;
  service_name: string;
  status: ServiceStatus;
  last_checked: string;
}

export interface ServicesApiResponse {
  success: boolean;
  count: number;
  data: Service[];
}
