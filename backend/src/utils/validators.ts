import { z } from "zod";

export const RegisterServerSchema = z.object({
  hostname: z.string().trim().min(1, "Hostname is required"),
  ipAddress: z.ipv4({ message: "Invalid IPv4 address" }), 
  osName: z.string().trim().min(1, "OS name is required"),
  agentVersion: z.string().trim().min(1, "Agent version is required"),
});



export const PostMetricsSchema = z.object({
//   serverId: z.uuid(),

  cpuUsage: z.number().min(0).max(100),

  memoryUsage: z.number().min(0).max(100),

  diskUsage: z.number().min(0).max(100),

  uptimeSeconds: z.number().nonnegative(),

  networkIn: z.number().nonnegative(),

  networkOut: z.number().nonnegative(),
})




export const RegisterUserSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});




export const LoginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});