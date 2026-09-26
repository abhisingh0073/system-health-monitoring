"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCPUUsage = getCPUUsage;
const os_1 = __importDefault(require("os"));
function getCpuTimes() {
    const cpus = os_1.default.cpus();
    let idle = 0;
    let total = 0;
    cpus.forEach((cpu) => {
        idle += cpu.times.idle;
        total += cpu.times.user +
            cpu.times.nice +
            cpu.times.sys +
            cpu.times.irq +
            cpu.times.idle;
    });
    return { idle, total };
}
async function getCPUUsage() {
    const start = getCpuTimes();
    //wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const end = getCpuTimes();
    const idleDifference = end.idle - start.idle;
    const totalDifference = end.total - start.total;
    const usage = ((totalDifference - idleDifference) / totalDifference) * 100;
    return Number(usage.toFixed(2));
}
