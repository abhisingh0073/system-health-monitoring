// import { api } from "@/lib/api";
// import type { Server } from "@/types/server";
// import type { Metrics } from "@/types";
import type { ApiResponse, PaginatedResponse,} from "@/types/api";
// import { Service } from "@/types/service";


// export async function getAllServers(options?: RequestInit) {
//   return api.get<PaginatedResponse<Server[]>>("/servers", options);
// }

// export async function getServerById(id: string) {
//   return api.get<ApiResponse<Server>>(`/servers/${id}`,);
// }

// export async function getServerMetrics(id: string) {
//   return api.get<ApiResponse<Metrics[]>>(
//     `/servers/${id}/metrics`
//   );
// }


// export async function getServerServices(id: string){
//   return api.get<ApiResponse<Service[]>>(
//     `/servers/${id}/services`
//   );
// }





import { serverApi } from "@/lib/server-api";
import { Server } from "http";
import { Metrics } from "@/types";
import { Service } from "@/types/service";

export async function getAllServers() {
  return serverApi<PaginatedResponse<Server[]>>("/servers");
}

export async function getServerById(id: string) {
  return serverApi<ApiResponse<Server>>(`/servers/${id}`);
}

export async function getServerMetrics(id: string) {
  return serverApi<ApiResponse<Metrics[]>>(
    `/servers/${id}/metrics`
  );
}

export async function getServerServices(id: string) {
  return serverApi<ApiResponse<Service[]>>(
    `/servers/${id}/services`
  );
}