"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemoryUsage = getMemoryUsage;
const os_1 = __importDefault(require("os"));
function getMemoryUsage() {
    const totalMemory = os_1.default.totalmem();
    const freeMemory = os_1.default.freemem();
    const usedMemory = totalMemory - freeMemory;
    // return{totalMemory, freeMemory, usedMemory};
    const memoryUsagePercentage = (usedMemory / totalMemory) * 100;
    return Number(memoryUsagePercentage.toFixed(2));
}
