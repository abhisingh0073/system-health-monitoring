"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkUsage = getNetworkUsage;
const fs_1 = __importDefault(require("fs"));
function getNetworkUsage() {
    const content = fs_1.default.readFileSync("/proc/net/dev", "utf8");
    const lines = content.trim().split("\n").slice(2);
    let totalReceived = 0;
    let totalSent = 0;
    for (const line of lines) {
        const [iface, stats] = line.split(":");
        if (!stats)
            continue;
        const interfaceName = iface.trim();
        // Ignore loopback interface
        if (interfaceName === "lo")
            continue;
        const values = stats.trim().split(/\s+/);
        totalReceived += Number(values[0]); // RX Bytes
        totalSent += Number(values[8]); // TX Bytes
    }
    return {
        networkIn: totalReceived,
        networkOut: totalSent,
    };
}
