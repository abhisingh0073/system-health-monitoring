"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicesStatus = getServicesStatus;
const node_child_process_1 = require("node:child_process");
function getServicesStatus() {
    const services = ["nginx", "postgresql", "redis", "docker", "ssh"];
    return services.map((service) => {
        try {
            const output = (0, node_child_process_1.execSync)(`systemctl is-active ${service} 2>&1`, {
                encoding: "utf-8"
            }).trim();
            if (output === "active") {
                return { service: service, status: "running" };
            }
            else if (output === "inactive" || output === "failed") {
                return { service: service, status: "stopped" };
            }
            else {
                return { service: service, status: "not_installed" };
            }
        }
        catch (error) {
            const message = String(error);
            if (message.includes("could not be found")) {
                return { service: service, status: "not_installed" };
            }
            return { service: service, status: "stopped" };
        }
    });
}
