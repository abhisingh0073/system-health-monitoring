import {execSync} from "child_process";

export function getDiskUsage(): number{
    const output = execSync("df -h /").toString();
    
    const lines = output.trim().split("\n");
    const rootLine = lines[lines.length - 1];
    const usage = rootLine.split(/\s+/)[4]; // Get the usage percentage (e.g., "50%")

    return Number(usage.replace("%", "")); // Convert to number and remove the "%" sign
}