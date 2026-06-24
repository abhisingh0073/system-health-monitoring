import os from "os";

export function getMemoryUsage(): number {
 
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

    // return{totalMemory, freeMemory, usedMemory};
    const memoryUsagePercentage = (usedMemory / totalMemory) * 100;
    return Number(memoryUsagePercentage.toFixed(2));
}
