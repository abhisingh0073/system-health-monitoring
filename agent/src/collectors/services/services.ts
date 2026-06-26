import { execSync } from "node:child_process";

interface ServiceStatus{
    service: string;
    status: "running" | "stopped" | "not_installed";
}

export function getServicesStatus():ServiceStatus[]{

    const services = ["nginx", "postgresql", "redis", "docker", "ssh"];

    return services.map((service) => {

        try{
    
            const output = execSync(`systemctl is-active ${service} 2>&1`, {
                encoding: "utf-8"
            }).trim();
    
    
            if(output === "active"){

                return { service: service, status: "running"};
            } else if(output === "inactive" || output === "failed"){

                return {service: service, status: "stopped"};
            } else{

                return {service: service, status: "not_installed"}
            }
        } catch(error){
            const message = String(error);

            if(message.includes("could not be found")){
                return {service: service, status: "not_installed"}
            }

            return {service: service, status: "stopped"}
        }
    });
}