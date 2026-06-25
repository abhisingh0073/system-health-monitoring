import { api } from "@/lib/api";
import type { Server } from "@/types/server";
import type { Metric } from "@/types";
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";

export async function getAllServers() {
  return api.get<PaginatedResponse<Server[]>>("/servers");
}

export async function getServerById(id: string) {
  return api.get<ApiResponse<Server>>(`/servers/${id}`);
}

export async function getServerMetrics(id: string) {
  return api.get<ApiResponse<Metric[]>>(
    `/servers/${id}/metrics`
  );
}