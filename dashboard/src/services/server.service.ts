import { api } from "@/lib/api";
import type { Server } from "@/types/server";
import type { Metrics } from "@/types";
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";
import { Service } from "@/types/service";


export async function getAllServers() {
  return api.get<PaginatedResponse<Server[]>>("/servers");
}

export async function getServerById(id: string) {
  return api.get<ApiResponse<Server>>(`/servers/${id}`);
}

export async function getServerMetrics(id: string) {
  return api.get<ApiResponse<Metrics[]>>(
    `/servers/${id}/metrics`
  );
}


export async function getServerServices(id: string){
  return api.get<ApiResponse<Service[]>>(
    `/servers/${id}/services`
  );
}
