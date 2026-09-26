"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiskUsage = getDiskUsage;
const child_process_1 = require("child_process");
function getDiskUsage() {
    const output = (0, child_process_1.execSync)("df -h /").toString();
    const lines = output.trim().split("\n");
    const rootLine = lines[lines.length - 1];
    const usage = rootLine.split(/\s+/)[4]; // Get the usage percentage (e.g., "50%")
    return Number(usage.replace("%", "")); // Convert to number and remove the "%" sign
}
