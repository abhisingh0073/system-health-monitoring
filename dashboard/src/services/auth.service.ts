import { api } from "@/lib/api";

export interface RegisterPayload{
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload{
    email: string;
    password: string;
}

interface AuthResponse{
    success: boolean;
    message: string;
    data?: {
        user: { 
          id: string;
          name: string;
          email: string;
        }     
    }
}

export function register(data: RegisterPayload){
    console.log(data);
    return api.post<AuthResponse>("/auth/register", data );
}

export function login(data: LoginPayload){
    return api.post<AuthResponse>("/auth/login", data );
}