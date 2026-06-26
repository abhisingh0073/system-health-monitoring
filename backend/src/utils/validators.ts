import { z } from "zod";

export const RegisterServerSchema = z.object({
  hostname: z.string().trim().min(1, "Hostname is required"),
  ipAddress: z.ipv4({ message: "Invalid IPv4 address" }), 
  osName: z.string().trim().min(1, "OS name is required"),
  agentVersion: z.string().trim().min(1, "Agent version is required"),
});



export const PostMetricsSchema = z.object({
  serverId: z.uuid(),

  cpuUsage: z.number().min(0).max(100),

  memoryUsage: z.number().min(0).max(100),

  diskUsage: z.number().min(0).max(100),

  uptimeSeconds: z.number().nonnegative(),

  networkIn: z.number().nonnegative(),

  networkOut: z.number().nonnegative(),
})