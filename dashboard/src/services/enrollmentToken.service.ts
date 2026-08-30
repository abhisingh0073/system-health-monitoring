import { api } from "@/lib/api";


export interface EntrollementTokenResponse{
  success: boolean;
  message: string;
  data: {
    token: string;
  }
}

export async function generateEnrollmentToken() {
  return api.post<EntrollementTokenResponse>("/enrollment", {});
}